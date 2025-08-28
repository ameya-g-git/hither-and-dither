from app import create_app

app = create_app()

app.config["MAX_CONTENT_LENGTH"] = None
app.config["MAX_FORM_MEMORY_SIZE"] = 25 * 1024 * 1024

if __name__ == "__main__":
    app.run(debug=True, port=4001, host="0.0.0.0")
