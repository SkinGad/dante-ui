package json

import (
	"encoding/json"
	"os"

	"github.com/SkinGad/dante-ui/model"
)

func ReadUser(fileName string) ([]model.User, error) {
	file, err := os.Open(fileName)
	if err != nil {
		if os.IsNotExist(err) {
			err = WriteUser(fileName, []model.User{})
			return []model.User{}, err
		}
	}
	defer file.Close()

	var users []model.User
	if err := json.NewDecoder(file).Decode(&users); err != nil {
		return nil, err
	}
	return users, nil
}
