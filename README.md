# **sizzle.io**

## Introduction

Check out the site as it comes out of the box here: https://sizzle-io.vercel.app/

This project is written in the Next.js framework and includes two main components:

1. A web frontend (includes i18n support with English and Japanese out of the box)

2. A simple REST API for managing poll data

If you know how to start a Next.js application, you can get this project up and running very quickly. The only requirement beyond that is configuring the service to point to a Redis server of your choice.

## Web Frontend
This section will cover how to spin up the web frontend.

First, install the dependencies (I use yarn, and a yarn.lock file is included):
```bash
yarn
#or
npm install
```

First, run the development server:

```bash
yarn dev
#or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## API Configuration
Out of the box the API is setup to use a Redis client for all data storage purposes. 

First, you will need to make sure you have `redis-server` installed. *Please search how to do this for your own operating system.*

Once you have `redis-server` installed, spin it up on the default port. Assuming it is added to your `PATH` environment variable, simply run 

```bash
redis-server
```
If you succeeded, you should see something that looks like below appear in your terminal (as well as some other messages, but just ignore them for now).

```
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 6.0.16 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 12260
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

```
Now that you have a Redis server running locally, try creating some polls in the web frontend and see the result.

To learn more about Redis, take a look at the following resource:

- [Redis Documentation](https://redis.io/docs/) - Learn about Redis features and management.
- [Try Redis](https://try.redis.io/) - an web based Redis client you can play around in.

## Deploying

When deploying the web frontend, you may need to configure a few environment variables if your Redis server is secured with username and password credentials.

The environment variables are:

- `NODE_REDIS_URL`
- `NODE_REDIS_USERNAME`
- `NODE_REDIS_PASSWORD`

## Contact

If you have any questions for me, feel free to contact me through [my website](https://www.davidjonesdev.com/contact).
