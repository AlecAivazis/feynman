package main

import (
	"bytes"
	"path"
	"fmt"
	"os/exec"
	"os"
	"io/ioutil"
	"strconv"
	"text/template"
)

// the configuration object for a given render
type RenderConfig struct {
	FontSize string
	Color string
	BaseLine string
	String string
}

var stringTemplate *template.Template

// RenderLatex takes a string of latex source and returns a readable
// which contains a png with the result.
func RenderLatex(conf *RenderConfig) ([]byte, error) {
	// log our intentions
	fmt.Println("Rendering string:", conf.String)

	// create a temporary directory we can render the equation inside
	tempDir, err := ioutil.TempDir("", "")
	if err != nil {
		return nil, err
	}
	// make sure we clean up when we're done
	defer os.RemoveAll(tempDir)
	// fmt.Println(tempDir)

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
			"-density", "300",
			pdfFile,
			"-quality", "90",
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

	// return the contents of the resulting file
	return ioutil.ReadFile(pngFile)
}

// LatexForConfig returns the latex document required to render the given equation
func LatexForConfig(conf *RenderConfig) []byte {
	// if there is no fontSize for this render
	if conf.FontSize == "" {
		// use the default
		conf.FontSize = "5.0"
	}

	// if there is no BaseLine for this render
	if conf.BaseLine == "" {
		// use the default
		val, err := strconv.ParseFloat(conf.FontSize, 32)
		// if nothing went wrnog
		if err == nil {
			// compute the baseline from the fontSize
			conf.BaseLine = strconv.FormatFloat(1.2 * val, 'f', -1, 32)
		}
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
	stringTemplate.Execute(&doc, conf)

	// return the byte string template
	return []byte(doc.String())
}

func init() {
	// build the template once
	template, err := template.ParseFiles("templates/base.tex.tmpl", "templates/string.tex.tmpl")
	// if something went wrong
	if err != nil {
		// yell loudly
		panic(err)
	}

	// save the compiled template in memory
	stringTemplate = template
}
