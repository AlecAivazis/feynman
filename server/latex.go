package main

import (
	"bytes"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path"
	"strconv"
	"text/template"
)

// the configuration object for a given render
type RenderConfig struct {
	FontSize float64
	Color    string
	BaseLine float64
	String   string
	MathMode bool
}

type BaseTemplateConfig struct {
	Content     string
	ExtraConfig string
}

var baseTemplate, stringTemplate, diagramTemplate, errorTemplate *template.Template

// RenderLatex takes a string of latex source and returns a byte array
// with a png displaying the result.
func renderLatex(template *template.Template, conf *RenderConfig, baseConf *BaseTemplateConfig) ([]byte, error) {
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

	config, err := latexForConfig(template, conf, baseConf)
	// if something went wrong
	if err != nil {
		// bubble up
		return nil, err
	}

	// write the equation to a file
	err = ioutil.WriteFile(equationFile, config, 0777)
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
		if err = cmd.Run(); err != nil {
			// stop executing commands and return the first error
			return nil, err
		}
	}

	// return the contents of the resulting file
	return ioutil.ReadFile(pngFile)
}

// LatexForConfig returns the latex document required to render the given equation
func latexForConfig(template *template.Template, conf *RenderConfig, baseConfig *BaseTemplateConfig) ([]byte, error) {
	// if there is no fontSize for this render
	if conf.FontSize == 0 {
		// use the default
		conf.FontSize = 5.0
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
	var diagram bytes.Buffer
	if template != nil {
		// execute the template
		template.Execute(&diagram, conf)

		// assign the rendered template to the config
		baseConfig.Content = diagram.String()

		// the full document
		var doc bytes.Buffer
		baseTemplate.Execute(&doc, baseConfig)

		// return the byte string template
		return []byte(doc.String()), nil
	}

	return []byte{}, errors.New("You must provide a template to render")
}

func writeLatex(w http.ResponseWriter, template *template.Template, config *RenderConfig, baseConfig *BaseTemplateConfig) {
	// create the buffer with the image contents
	img, err := renderLatex(template, config, baseConfig)
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

func init() {
	// build the templates once
	baseTemplate = template.Must(template.New("base.tex.tmpl").Delims("{%", "%}").ParseFiles(
		"templates/base.tex.tmpl",
	))
	diagramTemplate = template.Must(template.New("diagram.tex.tmpl").Delims("{%", "%}").ParseFiles(
		"templates/diagram.tex.tmpl",
	))
	errorTemplate = template.Must(template.New("error.tex.tmpl").Delims("{%", "%}").ParseFiles(
		"templates/error.tex.tmpl",
	))
	stringTemplate = template.Must(template.New("string.tex.tmpl").Delims("{%", "%}").ParseFiles(
		"templates/string.tex.tmpl",
	))
}
