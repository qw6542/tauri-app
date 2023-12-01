import { useState } from "react";
import reactLogo from "../assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "../App.css";

export function Home() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    // setGreetMsg(await invoke("greet", { name }));
    // setGreetMsg(await invoke("create_post", { title: name }));
    setGreetMsg(await invoke("list_posts_in_page", { page: 1, pageSize: 5 }));
  }

  async function listPosts() {
    setGreetMsg(await invoke("list_posts_in_page", { page: 1, pageSize: 5 }));
  }

  async function createPost() {
    setGreetMsg(await invoke("create_post", { title: 'title',  text:'lorem text' }));
  }

  async function deletePost() {
    setGreetMsg(await invoke("delete_post", { id: 1 }));
  }

  async function getPost() {
    setGreetMsg(await invoke("get_post", { id: 1 }));
  }

  async function updatePost() {
    const formData = {
      id: 1,
      title: 'updated title',
      text: 'updated text'
    }
    setGreetMsg(await invoke("update_post", formData));
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <button onClick={listPosts}>listPosts</button>  
      <button onClick={createPost}>createPost</button>  
      <button onClick={updatePost}>Update</button>  
      <button onClick={getPost}>getPost</button>  
      <button onClick={deletePost}>deletePost</button>  
      <p>{greetMsg}</p>
    </div>
  );
}
