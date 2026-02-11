package main

import (
	"flag"
	"io"
	"os"
	"strings"

	"github.com/SkinGad/dante-ui/pkg/json"
)

const fileDev = "go.mod"

func main() {
	fileSocksUser := "/etc/socksusers.json"
	if fileDevExists(fileDev) {
		fileSocksUser = "socksusers.json"
	}
	fileName := flag.String("f", fileSocksUser, "Set path to secret file")
	flag.Parse()

	username := os.Getenv("PAM_USER")
	if username == "" {
		os.Exit(1)
	}

	input, err := io.ReadAll(os.Stdin)
	if err != nil {
		os.Exit(1)
	}
	password := strings.TrimSpace(string(input))

	validUsers, err := json.ReadUser(*fileName)
	if err != nil {
		os.Exit(1)
	}
	for _, v := range validUsers {
		if v.Username == username && v.Password == password {
			os.Exit(0)
		}
	}
	os.Exit(1)
}

func fileDevExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
