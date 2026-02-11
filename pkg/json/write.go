package json

import (
	"encoding/json"
	"os"

	"github.com/SkinGad/dante-ui/model"
)

func WriteUser(fileName string, users []model.User) error {
	data, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(fileName, data, 0600)
}
