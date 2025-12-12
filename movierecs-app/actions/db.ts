'use server';
import fs from "fs";
import path from "path";
import type { Movie } from "@/types/tmdb-types"

const userFilePath = path.join(process.cwd(), "userData.json");
const movieFilePath = path.join(process.cwd(), "movieData.json");

const DEFAULT_USERS = {
  "logged_in_user": null,
  "users": []
}

function loadUsers() {
  if (!fs.existsSync(userFilePath)) {
    fs.writeFileSync(userFilePath, JSON.stringify(DEFAULT_USERS), "utf8");
    return DEFAULT_USERS;
  }
  const raw = fs.readFileSync(userFilePath, "utf8");
  return JSON.parse(raw);
}

function loadMovies() {
  if (!fs.existsSync(movieFilePath)) {
    fs.writeFileSync(movieFilePath, JSON.stringify({}), "utf8");
    return [];
  }
  const raw = fs.readFileSync(movieFilePath, "utf8");
  return JSON.parse(raw);
}

  /** Save the JSON back to disk */
function saveUsers(userData: any) {
  fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), "utf8");
}

function saveMovies(movieData: any) {
  fs.writeFileSync(movieFilePath, JSON.stringify(movieData, null, 2), "utf8");
}

export async function createUser(username: string, password: string){
  const userData = loadUsers();
  const userCount = userData.users.length;
  const exists = userData.users.find((u: any) => u.username === username);
  if (exists) throw new Error("User already exists");
  userData.users.push({
    id: userCount + 1001,
    username,
    password,
    ratings: []
  });
  saveUsers(userData);
  return true;
}

export async function loginUser(username: string, password: string) {
  const userData = loadUsers();
  const user = userData.users.find((u: any) => u.username === username);
  if (!user){
    throw new Error("User does not exist");
  }
  if (user.password !== password){
    throw new Error("Incorrect password");
  }
  userData.logged_in_user = username;
  saveUsers(userData);
  return true;
}

export async function getLoggedInUser() {
  console.log("loading userData...")
  const userData = loadUsers();
  console.log("userData loaded...")
  return userData.logged_in_user;
}

export async function logOut() {
  const userData = loadUsers();
  userData.logged_in_user = null
  saveUsers(userData)
}

export async function rate(rating: number, movie: Movie){
  const userData = loadUsers();
  const movieData = loadMovies();
  const username = userData.logged_in_user
  const user = userData.users.find((u: any) => u.username === username);
  const existingMovie = movieData.find((r: any) => r.id === movie.id)
  if (!existingMovie){
    movieData.push(movie)
  }
  if (!user) {
    throw new Error("Logged-in user not found in userDatabase");
  }
  const existingRating = user.ratings.find((r: any) => r.movieid === movie.id);
  if (existingRating) {
    existingRating.rating = rating
    existingRating.timestamp = Math.floor(Date.now()/1000)
  }
  else {
    user.ratings.push({
      movieid: movie.id,
      rating,
      userid: user.id,
      timestamp: Math.floor(Date.now()/1000)
    });
  }
  saveUsers(userData)
  saveMovies(movieData)
  return true
}

export async function getUserRating(movieid: number) {
  const userData = loadUsers();
  const username = userData.logged_in_user;
  if (!username) return
  const user = userData.users.find((u: any) => u.username === username);
  if (!user) return null;
  return user.ratings.find((r: any) => r.movieid === movieid) || null;
}

export async function findMovies(){
  const userData = loadUsers();
  const movieData = loadMovies();
  const username = userData.logged_in_user
  const user = userData.users.find((u: any) => u.username === username);
  //const existingMovie = movieData.find((r: any) => r.id === movie.id)
  if (!user) {
    throw new Error("Logged-in user not found in userDatabase");
  }
  const listMovies2= userData.users
  console.log('ass')
  console.log(listMovies2)
  let returnArray= [1]
  returnArray.pop()
  let rightObject=listMovies2[0]
  for (let i = 0; i < listMovies2.length; i++){
    if(listMovies2[i].username==username){
      rightObject=listMovies2[i]
    }
  }
  let listMovies=rightObject.ratings
  console.log(listMovies)
  console.log(Object.keys(listMovies).length)
  console.log(listMovies.length)
  if(Object.keys(listMovies).length < 5){
    let numRandoms=5-listMovies.length
    for (let i = 0; i < numRandoms; i++){
      //returnArray.push(722)
      returnArray.push(Math.floor(Math.random() * (300-1) +1));
    }
    for (let i = 0; i < listMovies.length; i++) {
      //console.log(listMovies[i]);
      if(i+numRandoms>=5){
        break;
      }
      const entryPush=listMovies[listMovies.length-1-i].movieid
      returnArray.push(entryPush)
    }
    return returnArray.splice(0,1)
  }
  let watchFlag=0
  for (let i = 0; i < listMovies.length; i++) {
    if(returnArray.length==6){
      break;
    }
    //console.log(listMovies[i]);
    let ratingS= listMovies[listMovies.length-1-i].rating
    //console.log(ratingS)
    if (ratingS<5){
      if(watchFlag===0){
        watchFlag=i+1
      }else{
        if(i!=listMovies.length-1){
          continue;
        }
      }
    }
    const entryPush=listMovies[listMovies.length-1-i].movieid

    returnArray.push(entryPush)

  }
  let url1='http://localhost:8080/api/rec2/getSimilar?id='+String(returnArray[0])
  let url2='http://localhost:8080/api/rec2/getSimilar?id='+String(returnArray[1])
  let url3='http://localhost:8080/api/rec2/getSimilar?id='+String(returnArray[2])
  let url4='http://localhost:8080/api/rec2/getSimilar?id='+String(returnArray[3])
  let url5='http://localhost:8080/api/rec2/getSimilar?id='+String(returnArray[4])
  
  let recMovies=[]
  //console.log(url1)
  const response = await fetch(url1);
  const data= await response.json()
  //console.log(data)
  recMovies.push(data[0])
  recMovies.push(data[1])
  const response1 = await fetch(url2);
  const data1= await response1.json()
  recMovies.push(data1[0])
  recMovies.push(data1[1])

  const response3 = await fetch(url3);
  const data3= await response3.json()
  recMovies.push(data3[0])
  recMovies.push(data3[1])

  const response4 = await fetch(url4);
  const data4= await response4.json()
  recMovies.push(data4[0])
  recMovies.push(data4[1])

  const response5 = await fetch(url5);
  const data5= await response5.json()
  recMovies.push(data5[0])
  recMovies.push(data5[1])


  console.log(recMovies)
  console.log(recMovies[2])
  //console.log(watchFlag)

  let movieBase='https://api.themoviedb.org/3/'
  let myURL= 'movie/'+String(703398)
  let apiURL=movieBase+myURL

  //console.log(apiURL)

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTE2YTAxMTc4YzU2NWRjNGZkNGRlM2NjNTI3NTc2NyIsIm5iZiI6MTc2MTc2NTg5OC40NDQsInN1YiI6IjY5MDI2YTBhZjcwOWE1OTRiNWVlN2E3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RarF4iMCJpwv3pZoJpSAdvyhrgtMWsTP597vf-_jM-A`, //${TMDB_READ_ACCESS_TOKEN}
    },
  };
  const responseMovie = await fetch(apiURL, options);
  //console.log(responseMovie)
  const dataMovie=await responseMovie.json()
  //console.log(dataMovie)
  let posterPath=null
  if(dataMovie.poster_path != null){
    let basePath='https://image.tmdb.org/t/p/w1280'
    posterPath=basePath+dataMovie.poster_path
    //posterPath='grayBox'
  }

  const theTitle=dataMovie.original_title
  const theDescription=dataMovie.overview
  let shortVersion=''
  //console.log(theTitle)

  let finalArray=[]
  finalArray.push(theTitle)
  finalArray.push(posterPath)
  finalArray.push(dataMovie.id)
  //console.log(finalArray)


  console.log(returnArray.splice(1,5))

  //Cutting duplicates
  var lookup = [];
      var items = recMovies;
      var result = [];

      for (var item, i = 0; item = items[i++];) {
          var name = item.id
          if (!(name in lookup)) {
              lookup.push(name);
              result.push(item);
          }
        }
  result.push(watchFlag)
  return result;
  //return returnArray;
}