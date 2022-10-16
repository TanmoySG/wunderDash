<img src="https://user-images.githubusercontent.com/36238254/125580769-807c0da3-077f-4dab-910f-21ecf2e814bc.png" height="50px" width="50px" />

# wunderDash for wunderDB

[**wunderDB**](https://wdb.tanmoysg.com/index.html) is a JSON-based web-store to store an manage your data remotely and securely.

**wunderDash** is an official GUI Client that helps to manage your clusters on wunderDB, using an interactive interface. Built on ReactJS, wunderDash is fast and efficient with beautiful a UI.

## Running Locally 

To run the Client, locally, on your device, we recommend using the [Docker Image](https://github.com/TanmoySG/wunderDash/pkgs/container/wunderdash). 

Start the WunderDB server locally or use an hosted instance like [wdb.tanmoysg.com](https://wdb.tanmoysg.com/index.html). To run WDB Locally refer to it's [official documentation](https://github.com/TanmoySG/wunderDB#readme).

Once WDB is up and running, get the URL and replace it in the [Docker Compose](docker-compose.yml) File `build-args` as
```yml
build:
    args: 
    WDB_URL: "<WDB URL>"
```

Then run the docker-compose command to start the container.
```
docker-compose build
docker-compose up
```

Now you can use the wunderDash to interact with your data and clusters.

**Please Note**, that when you need to update/change the WDB URL, you'll need to update the docker-compose file everytime and build it on every change of WDB URL for the updated URL to be used in the App.

### Alternative

Alternately, you can also run the project in memory. Clone the repository as
```shell
git clone https://github.com/TanmoySG/wunderDash
cd wunderDash
```

With the WDB URl, export it as an environment variable and run the Shell script to generate the WDB Config File in `/src/assets` directory and also to build the react app.
```shell
export WDB_URL="you.url.here:8000"
sh scripts/start-up.sh .
```

The code is built and you can find it in the `/build` directory. Now to run it, install [Vercel Serve](https://github.com/vercel/serve) and run the `serve` command on the build directory to serve the Built wDash App.
```shell
npm install --global serve  
serve build
```

