package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/pkg/browser"
)

/*
system_profiler -detailLevel mini -json SPHardwareDataType> ~/output.jso
*/

var systemInfo *SystemInfo

func serveUp(info *SystemInfo) {

	handler := func(w http.ResponseWriter, r *http.Request) {
		data, err := Asset("index.html")
		handle(err)
		tmpl, err := template.New("test").Parse(string(data))
		handle(err)

		tmpl.Execute(w, info)
	}

	// Use npm package inliner to compile the whole project into a single html doc
	browser.OpenURL("http://localhost:8080")

	http.HandleFunc("/", handler)
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

func restCalls() {
	fs := http.FileServer(http.Dir("."))
	http.Handle("/", fs)
	http.HandleFunc("/data.json", dataEndpoint)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func main() {
	restCalls()
}
