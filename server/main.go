package main

import (
	"fmt"
	"strconv"
	"net/http"
)


func renderLatexHandler(w http.ResponseWriter, r *http.Request) {
	// we expect the equation to render as the equation query parameter in the request
	eqn := r.URL.Query().Get("equation")
	fmt.Println("Rendering equation ", eqn)

	// create the buffer with the image contents using the local disk for temp files
	img, err := RenderLatex(&RenderConfig{
		String: eqn,
	})
	// if something went wrong
	if err != nil {
		// send the error to the user as text
		w.Write([]byte(err.Error()))
	}

	// since we render the equation as a png, we need to set the appropriate headers
	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Content-Length", strconv.Itoa(len(img)))

	// copy the equation to the response
	w.Write(img)
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
