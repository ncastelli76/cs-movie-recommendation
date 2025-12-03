'use server';
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "userdata.json");

function load() {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

  /** Save the JSON back to disk */
function save(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function createUser(username: string, password: string){
  const data = load();
  const exists = data.users.find((u: any) => u.username === username);
  if (exists) throw new Error("User already exists");
  data.users.push({
    username,
    password,
    ratings: []
  });
  save(data);
  return true;
}

export async function loginUser(username: string, password: string) {
  const data = load();
  const user = data.users.find((u: any) => u.username === username);
  if (!user){
    throw new Error("User does not exist");
  }
  if (user.password !== password){
    throw new Error("Incorrect password");
  }
  data.logged_in_user = username;
  save(data);
  return true;
}

export async function getLoggedInUser() {
  console.log("loading data...")
  const data = load();
  console.log("data loaded...")
  return data.logged_in_user;
}

export async function logOut() {
  const data = load();
  data.logged_in_user = null
  save(data)
}

export async function rate(rating: number, id: number){
  const data = load();
  const username = data.logged_in_user
  const user = data.users.find((u: any) => u.username === username);
  if (!user) {
    throw new Error("Logged-in user not found in database");
  }
  const existing = user.ratings.find((r: any) => r.movieid === id);
  if (existing) {
    existing.rating = rating
  }
  else {
    user.ratings.push({
      movieid: id,
      rating
    });
  }
  save(data)
  return true
}

export async function getUserRating(movieid: number) {
  const data = load();
  const username = data.logged_in_user;
  const user = data.users.find((u: any) => u.username === username);
  if (!user) return null;
  return user.ratings.find((r: any) => r.movieid === movieid) || null;
}