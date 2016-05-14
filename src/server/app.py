"""
    This file defines the feynman server.
"""
# external imports
import os
from subprocess import call, PIPE, Popen
import tempfile
from collections import defaultdict
from flask import Flask, render_template, send_file, send_from_directory

# define the app object
app = Flask(__name__)
# use jade for the template engine
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')


@app.route('/')
def index():
    """
        The primary endpoint for the web application.
    """
    return render_template('index.jade')


@app.route('/latex')
def latex():
    """
        This endpoint renders the desired string to the response or an error if it fails.
    """

    # the templates for the latex document
    string_template = "latex/string.tex"
    error_template = "latex/error.tex"


    # default paramter values
    template_context = defaultdict(
        color='black',
        fontsize=5,
        isMath=True,
        equation = ' '
    )

    # update the context with the request parameters
    template_context.update(request.GET)

    # create a context object from the dict
    context = Context(template_context)

    # grab the string template
    template = get_template(self.string_template)
    # render the template with the specfied context
    latex = template.render(context).encode('utf-8')

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
        process.communicate(latex)

        # save references to the location of the pdf and png outputs
        pdf = os.path.join(tempdir, 'tex.pdf')
        raster = os.path.join(tempdir, 'tex.png')
        # use the convert command from image magick to convert the pdf to a png
        call(['convert', '-density', '300', pdf, '-quality', '90', raster])

        # once the convert is done, send the file as the response
        send_file(raster)


# if running the file from the command line
if __name__ == '__main__':
    # run the web application
    app.run(debug=True)
