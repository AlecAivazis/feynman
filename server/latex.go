package main

import (
	"net/http"
	"strconv"
	"path"
	"os/exec"
	"fmt"

	"github.com/spf13/afero"
)

// LatexForEquation returns the latex document required to render the given equation
func LatexForEquation(eqn string) []byte {
	return []byte(eqn)
}

// RenderLatex takes a string of latex source and returns a readable
// which contains a png with the result.
func RenderLatex(eqn string, fs afero.Fs) ([]byte, error) {
	// create a temporary directory we can render the equation inside
	tempDir := afero.GetTempDir(fs, "render-" + eqn)
	// make sure we clean up when we're done
	// defer fs.RemoveAll(tempDir)
	fmt.Println(tempDir)

	// filepaths used throughout the process
	equationFile := path.Join(tempDir, "equation.tex") // holds the equation source
	pdfFile := path.Join(tempDir, "equation.pdf")      // the pdf created along the way
	pngFile := path.Join(tempDir, "equation.png")      // the final png

	// write the equation to a file
	err := afero.WriteFile(fs, equationFile, LatexForEquation(eqn), 0777)
	// if something went wrong
	if err != nil {
		// bubble up
		return nil, err
	}

	// the series of bash commands to convert the equation to an image
	pipeline := []*exec.Cmd{
		exec.Command(
			"pdflatex",
			fmt.Sprintf("-output-directory %s", tempDir),
			equationFile,
		),
		exec.Command(
			"convert",
			fmt.Sprintf("-density %s", "300"),
			pdfFile,
			fmt.Sprintf("-quality %s", "90"),
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
	return afero.ReadFile(fs, pngFile)
}

// WriteEquation writes the equation contained in the string to the http writer
func WriteEquation(w http.ResponseWriter, eqn string) error {
	// create the buffer with the image contents using the local disk for temp files
	img, err := RenderLatex(eqn, afero.NewOsFs())
	// if something went wrong
	if err != nil {
		return err
	}

	// since we render the equation as a png, we need to set the appropriate headers
	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Content-Length", strconv.Itoa(len(img)))

	// copy the equation to the response
	w.Write(img)
	// nothing went wrong
	return nil
}
