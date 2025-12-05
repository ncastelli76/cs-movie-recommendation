'use server';
import fs from "fs";
import path from "path";
import type { Movie } from "@/types/tmdb-types"

const userFilePath = path.join(process.cwd(), "userData.json");
const movieFilePath = path.join(process.cwd(), "movieData.json");

function loadUsers() {
  const raw = fs.readFileSync(userFilePath, "utf8");
  return JSON.parse(raw);
}

function loadMovies() {
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
  const exists = userData.users.find((u: any) => u.username === username);
  if (exists) throw new Error("User already exists");
  userData.users.push({
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
  }
  else {
    user.ratings.push({
      movieid: movie.id,
      rating
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