package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/pkg/browser"
)

var systemInfo *SystemInfo

func serveUp() {

	handler := func(w http.ResponseWriter, r *http.Request) {
		data, err := Asset("inlined.html")
		handle(err)
		fmt.Fprint(w, string(data))
		handle(err)

	}

	// Use npm package inliner to compile the whole project into a single html doc
	browser.OpenURL("http://localhost:8080")

	http.HandleFunc("/", handler)
	http.HandleFunc("/data.json", dataEndpoint)
	log.Fatal(http.ListenAndServe(":8080", nil))

}

func handler(w http.ResponseWriter, r *http.Request) {
	data, err := Asset("index.html")
	handle(err)
	fmt.Fprintf(w, string(data))
}

func dataEndpoint(w http.ResponseWriter, r *http.Request) {
	if systemInfo == nil {
		// If this is the first time the data endpoint has been
		// hit, retrieve the info
		systemInfo = profileSystem()
	}
	json.NewEncoder(w).Encode(*systemInfo)
}

func main() {
	serveUp()
}
