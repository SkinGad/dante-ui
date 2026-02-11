package main

import (
	js "encoding/json"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/SkinGad/dante-ui/frontend"
	"github.com/SkinGad/dante-ui/model"
	"github.com/SkinGad/dante-ui/pkg/json"
)

const fileDev = "go.mod"

var fileName string
var publicAddress string
var publicPort int

func main() {
	fileSocksUser := "/etc/socksusers.json"
	if fileDevExists(fileDev) {
		fileSocksUser = "socksusers.json"
	}
	fileName = *flag.String("f", fileSocksUser, "Set path to secret file")
	publicAddress = *flag.String("a", "nil", "Set public IP")
	publicPort = *flag.Int("pp", 1080, "Set public proxy port")
	listenAddress := flag.String("la", "0.0.0.0", "Set listen port")
	listenPort := flag.Int("lp", 8080, "Set listen port")
	flag.Parse()

	if publicAddress == "nil" {
		publicAddress = getPublicIP()
	}

	staticFS, err := fs.Sub(frontend.FS, "dist")
	if err != nil {
		log.Fatal(err)
	}
	http.HandleFunc("/api/v1/add_user", addUserHandler)
	http.HandleFunc("/api/v1/users", listUsersHandler)
	http.HandleFunc("/api/v1/user", deleteUserHandler)
	http.HandleFunc("/api/v1/get_link", getLinkUserHandler)

	http.Handle("/", http.FileServer(http.FS(staticFS)))

	fmt.Printf("Admin panel running at http://%s:%d\n", *listenAddress, *listenPort)
	http.ListenAndServe(fmt.Sprintf("%s:%d", *listenAddress, *listenPort), nil)
}

func addUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Use POST", http.StatusMethodNotAllowed)
		return
	}
	username := r.FormValue("username")
	password := r.FormValue("password")
	if username == "" || password == "" {
		http.Error(w, "Username and password required", http.StatusBadRequest)
		return
	}

	users, _ := json.ReadUser(fileName)
	if checkExistUser(username, users) {
		http.Error(w, "A user with this username already exists", http.StatusBadRequest)
		return
	}
	users = append(users, model.User{Username: username, Password: password, Id: getMaxId(users)})
	json.WriteUser(fileName, users)

	fmt.Fprintf(w, "User %s added\n", username)
}

func listUsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Use GET", http.StatusMethodNotAllowed)
		return
	}
	users, _ := json.ReadUser(fileName)
	js.NewEncoder(w).Encode(users)
}

func getLinkUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Use GET", http.StatusMethodNotAllowed)
		return
	}
	id := r.FormValue("id")
	if id == "" {
		http.Error(w, "id required", http.StatusBadRequest)
		return
	}

	idint, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "id invalid", http.StatusBadRequest)
		return
	}

	users, _ := json.ReadUser(fileName)

	for _, v := range users {
		if v.Id == idint {
			fmt.Fprintf(w,
				"https://t.me/socks?server=%s&port=%d&user=%s&pass=%s",
				publicAddress,
				publicPort,
				v.Username,
				v.Password)
			return
		}
	}
	http.Error(w, "User not found", http.StatusBadRequest)
}

func deleteUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Use DELETE", http.StatusMethodNotAllowed)
		return
	}
	id := r.FormValue("id")
	if id == "" {
		http.Error(w, "id required", http.StatusBadRequest)
		return
	}

	idint, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "id invalid", http.StatusBadRequest)
		return
	}

	users, _ := json.ReadUser(fileName)
	i := getIndexUser(idint, users)

	users = append(users[:i], users[i+1:]...)
	json.WriteUser(fileName, users)

	fmt.Fprintf(w, "User %s deleted\n", id)
}

func getMaxId(users []model.User) (id int) {
	for _, v := range users {
		if v.Id > id {
			id = v.Id
		}
	}
	id++
	return
}

func checkExistUser(user string, users []model.User) bool {
	for _, v := range users {
		if v.Username == user {
			return true
		}
	}
	return false
}

func getIndexUser(id int, users []model.User) int {
	for i, v := range users {
		if v.Id == id {
			return i
		}
	}
	return 0
}

func getPublicIP() string {
	url := "https://ipinfo.io/ip"

	resp, err := http.Get(url)
	if err != nil {
		log.Println("Error while requesting:", err)
		return ""
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error reading response:", err)
		return ""
	}

	return string(body)
}

func fileDevExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
