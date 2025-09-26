import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { useForm } from "../utils/useForm";
import { post } from "../utils/useFetch";
// import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const { handleChange, form } = useForm({
    username: "",
    password: "",
  });


  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setErrorMessage("Provide an username and password");
      return;
    }

    setLoading(true);
    const res = await post("/v1/users/signup", form);

    if (res) setLoading(false);

    if (res.status >= 400) { (setErrorMessage(res.data.message)) } else navigate("/login");
  };

  onMount(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  });

  return (
    <div class="vh-100 vw-100 flex justify-center items-center p-3">
      <form class="card" onsubmit={handleSubmit}>
        <h2>Signup</h2>
        <div class="flex g-2">
          <button class="outline w-100">
            <i class="fa-brands fa-google fa-xl"></i> Google
          </button>
        </div>
        <div class="flex flex-col g-2">
          <label for="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
          ></input>
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          ></input>
        </div>
        <button class="primary" type="submit" disabled={loading()}>
          {loading() ? "Loading..." : "Signup"}
        </button>
        {errorMessage() && <small class="txt-danger">{errorMessage()}</small>}
        <div class="flex justify-center items-center">
          <a href="/login">
            <small class="txt-ul">Have an account?</small>
          </a>
        </div>
      </form>
    </div>
  );
}