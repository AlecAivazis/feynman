"""
    This file defines the feynman server.
"""
# external imports
import os
from subprocess import call, PIPE, Popen
import tempfile
from collections import defaultdict
from flask import Flask, render_template, send_file, send_from_directory, request
import click

# define the app object
app = Flask(__name__)
# use jade for the template engine
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

@app.template_filter()
def add_braces(content):
    return "{" + str(content) + "}"


@app.route('/latex')
def latex():
    """
        This endpoint renders the desired string to the response or an error if it fails.
    """

    # the templates for the latex document
    string_template = "string.tex"
    error_template = "error.tex"


    # default paramter values
    template_context = defaultdict(
        color='black',
        fontSize=5,
        isMath=True,
        equation = ' '
    )
    # update the context with the request parameters
    template_context.update(request.args.to_dict())

    template_context['baseLine'] = 1.2 * template_context['fontSize']

    # render the template with the specfied context
    latex = render_template(string_template, **template_context).encode('utf-8')
    print(latex)
    # open a temporary directory where we can put the rendered latex
    with tempfile.TemporaryDirectory() as tempdir:
        # run pdflatex with the output directory pointing to the temporary loc
        process = Popen(
            ['pdflatex', '-output-directory', tempdir, '-jobname', 'tex'],
            # supress output with PIPEs
            stdin = PIPE,
            stdout = PIPE,
        )
        # send pdflatex the latex string to be rendered
        out, err = process.communicate(latex)

        # save references to the location of the pdf and png outputs
        pdf = os.path.join(tempdir, 'tex.pdf')
        raster = os.path.join(tempdir, 'tex.png')
        # use the convert command from image magick to convert the pdf to a png
        call(['convert', '-density', '300', pdf, '-quality', '90', raster])

        # once the convert is done, send the file as the response
        return send_file(raster)


@click.command()
@click.option('--port', default=5000)
@click.option('--debug', default=False)
def run(port, debug):
    # run the web application with the appropriate configuration
    app.run(debug=debug, port=port, host='0.0.0.0')


# if running the file from the command line
if __name__ == '__main__':
    # execute the cli
    run()
