package main

import (
	"fmt"
	"net/http"
	"strconv"
)

func renderLatexHandler(w http.ResponseWriter, r *http.Request) {
	// look for a math mode query parameter
	mathQuery := r.URL.Query().Get("mathMode")
	// try to turn the query parameter into a boolean
	mathMode, _ := strconv.ParseBool(mathQuery)

	// look for a font size query parameter
	fontSizeQuery := r.URL.Query().Get("fontSize")
	// try to turn the query parameter into a float
	fontSize, _ := strconv.ParseFloat(fontSizeQuery, 64)

	// look for a font size query parameter
	baseLineQuery := r.URL.Query().Get("baseLine")
	// try to turn the query parameter into a float
	baseLine, _ := strconv.ParseFloat(baseLineQuery, 64)

	// the config provided by the user
	config := &RenderConfig{
		String:   r.URL.Query().Get("string"),
		FontSize: fontSize,
		BaseLine: baseLine,
		Color:    r.URL.Query().Get("color"),
		MathMode: mathMode,
	}

	// log our intentions
	fmt.Println("Rendering string:", config.String)

	// respond with the latex document
	writeLatex(w, stringTemplate, config, &BaseTemplateConfig{
		ExtraConfig: "varwidth=true,",
	})
}

func renderDiagramHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("rendering diagram")
	w.Header().Set("Content-Disposition", "attachment; filename=diagram.png")

	// the config provided by the user
	config := &RenderConfig{
		String: r.URL.Query().Get("string"),
	}

	// respond with the latex document
	writeLatex(w, diagramTemplate, config, &BaseTemplateConfig{})
}

func main() {
	// where the server is listening on local host
	port := ":8081"

	// set up the mux
	http.HandleFunc("/string", renderLatexHandler)
	http.HandleFunc("/diagram", renderDiagramHandler)

	// notify the user we're going to start the server
	fmt.Println("🚀  listening on " + port)

	// start the server
	err := http.ListenAndServe(port, nil)
	// if something went wrong
	if err != nil {
		// yell loudly
		panic(err)
	}
}
