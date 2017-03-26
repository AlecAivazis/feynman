package main

import (
	"fmt"

	"net/http"
)

func renderLatexHandler(w http.ResponseWriter, r *http.Request) {
	// we expect the equation to render as the equation query parameter in the request
	eqn := r.URL.Query().Get("equation")
	// if there wasn't one provided
	if eqn == "" {
		// use the latex-valid empty string
		eqn = " "
	}

	// render the text and send the resulting image back to the user
	err := WriteEquation(w, eqn)
	// if something goes wrong
	if err != nil {
		fmt.Println(err.Error())
	}
}


func main() {
	// where the server is listening on local host
	port := ":8081"

	// set up the mux
	http.HandleFunc("/", renderLatexHandler)

	// notify the user we're going to start the server
	fmt.Println("listening on " + port)
	// start the server
	http.ListenAndServe(port, nil)
}
