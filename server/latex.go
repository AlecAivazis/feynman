package main

import (
	"bytes"
	"net/http"
	"strconv"
	"path"
	"fmt"
	"os"
	"os/exec"
	"io/ioutil"
)

// the configuration object for a given render
type RenderConfig struct {
	FontSize float32
	Color string
	BaseLine float32
	String string
}


// LatexForConfig returns the latex document required to render the given equation
func LatexForConfig(conf *RenderConfig) []byte {
	// if there is no fontSize for this render
	if conf.FontSize == 0 {
		// use the default
		conf.FontSize = 5
	}

	// if there is no BaseLine for this render
	if conf.BaseLine == 0 {
		// use the default
		conf.BaseLine = 1.2 * conf.FontSize
	}

	// if there is no Color for this render
	if conf.Color == "" {
		// use the default
		conf.Color = "black"
	}

	// if there is no String for this render
	if conf.String == "" {
		// use the default
		conf.String = " "
	}

	// a buffer to hold the rendered template
	var doc bytes.Buffer
	// execute the template
	latexTemplate.Execute(&doc, conf)

	// return the byte string template
	return []byte(doc.String())
}

// RenderLatex takes a string of latex source and returns a readable
// which contains a png with the result.
func RenderLatex(conf *RenderConfig) ([]byte, error) {
	// create a temporary directory we can render the equation inside
	tempDir, err := ioutil.TempDir("", "")
	if err != nil {
		return nil, err
	}
	// make sure we clean up when we're done
	defer os.RemoveAll(tempDir)

	// filepaths used throughout the process
	equationFile := path.Join(tempDir, "equation.tex") // holds the equation source
	pdfFile := path.Join(tempDir, "equation.pdf")      // the pdf created along the way
	pngFile := path.Join(tempDir, "equation.png")      // the final png

	// write the equation to a file
	err = ioutil.WriteFile(equationFile, LatexForConfig(conf), 0777)
	// if something went wrong
	if err != nil {
		// bubble up
		return nil, err
	}

	// the series of bash commands to convert the equation to an image
	pipeline := []*exec.Cmd{
		exec.Command(
			"pdflatex",
			fmt.Sprintf("-output-directory=%s", tempDir),
			equationFile,
		),
		exec.Command(
			"convert",
			pdfFile,
			pngFile,
		),
	}

	// perform the commands in the pipeline
	for _, cmd := range pipeline {
		// run the command and check if something went wrong
		if err = cmd.Run() ; err != nil {
			// stop executing commands and return the first error
			return nil, err
		}
	}

	// return the resulting file
	return ioutil.ReadFile(pngFile)
}

// WriteEquation writes the equation contained in the string to the http writer
func WriteEquation(w http.ResponseWriter, eqn string) {

	// build the render config for the request
	config := &RenderConfig{
		String: eqn,
	}

	// create the buffer with the image contents using the local disk for temp files
	img, err := RenderLatex(config)
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
