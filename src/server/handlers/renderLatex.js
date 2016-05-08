// external imports
import nunjucks from 'nunjucks'
import stream from 'stream'
import path from 'path'
import imagemagick from 'imagemagick'
import temp from 'temp'
import {spawn} from 'child_process'
import fs from 'fs'
// local imports
import {templatesDir} from 'config/projectPaths'

// create a template environment 
const template = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(templatesDir, 'latex'))
)

// add the braces filter
template.addFilter('add_braces', (content) => `{${content}}`)

// nunjucks.env.addFilter('add_braces', content => `{${content}}`)

// this module exports a handler that renders the given string in pdlatex
export default (req, res) => {
    // the template context variables
    const context = {
        color: 'black',
        fontSize: 5,
        isMath: true,
        equation: ' ',
        ...req.query,
    }
    // set the baseline from the fontsize
    context['baseLine'] = 1.2 * parseInt(context.fontSize)

    // this function will render the given template through pdflatex and 
    // reply with an image
    function renderTemplateAsLaTeX(path, extraContext) {
        // render the template
        const renderedTemplate = template.render(path, {
            ...context,
            ...extraContext,
        })

        // cleanup the directory when we're done
        temp.track()

        // make a temp directory
        temp.mkdir('feynman', (err, tempDir) => {

            // the filepath of the tex equation
            const texSource = tempDir + '/equation.tex'
            const equationPDF = tempDir + '/equation.pdf'
            const equationPNG = tempDir + '/equation.png'

            // exec(`pdflatex -output-directory ${tempDir} -jobname tex`)
            fs.writeFileSync(texSource, renderedTemplate)

            // const child = spawn(`pdflatex -output-directory ${tempDir} -jobname tex asdf`)
            // convert the latex file to pdf
            const pdflatex = spawn('pdflatex', [
                '-output-directory='+tempDir,
                texSource
            ])

            pdflatex.on('close', (code) => {
                // if the process ended abruptly
                if (code !== 0) {
                    console.log(`ps process exited with code ${code}`)
                }
                console.log('hello?')
                // otherwise the process ended normally
                imagemagick.convert([
                    '-density', 
                    '300', 
                    equationPDF, 
                    '-quality', 
                    '90', 
                    equationPNG
                ], (error, stdout) => {
                    // if there was an error converting the pdf to an image
                    if (error) {
                        // log it
                        console.log("ERROR: " + error)
                    // otherwise the image was created successfully
                    } else {
                        // open the image
                        const img = fs.readFileSync(equationPNG)
                        // set the correct header
                        res.writeHead(200, {'Content-Type': 'image/png' })
                        // close the response with the image
                        res.end(img, 'binary')
                    }
                })
            })

            pdflatex.stderr.on('data', (data) => {
                console.log(`pdflatex stderr: ${data}`)
            })

            pdflatex.stdout.on('data', (data) => {
                console.log(data.toString())
            })

        })

    }

    try {
        // render the given string
        renderTemplateAsLaTeX('string.tex')
    // if something goes wrong
    } catch (err) {
        // render the error template file
        renderTemplateAsLaTeX('error.tex', {error: err})
    }

}