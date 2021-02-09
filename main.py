from blueprints import create_app

app = create_app()

if __name__ == '__main__':
    port = 80
    host = "0.0.0.0"
    app.run(host=host,port=port,debug=True)