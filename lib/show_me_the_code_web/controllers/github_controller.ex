defmodule ShowMeTheCodeWeb.GithubController do
  use ShowMeTheCodeWeb, :controller

  def auth(conn, _params) do
    query = %{
      "client_id" => get_client_id(),
      "scope" => "gist read:user user:email",
      "redirect_uri" => "http://localhost:4200/api/auth/github/callback"
    }
    redirect(conn, external: "https://github.com/login/oauth/authorize?#{URI.encode_query(query)}")
  end

  def callback(conn, %{"code" => code}) do
    case exchange_token(code) do
      {:ok, token} ->
        conn
        |> put_resp_cookie("github_token", token)
        |> redirect(to: "/")
      _ -> put_status(conn, 403)
    end
  end

  defp get_client_id() do
    Application.get_env(:show_me_the_code, ShowMeTheCodeWeb.Endpoint)[:github_client_id]
  end

  defp get_client_secret() do
    Application.get_env(:show_me_the_code, ShowMeTheCodeWeb.Endpoint)[:github_client_secret]
  end

  defp exchange_token(code) do
    client_id = get_client_id()
    client_secret = get_client_secret()
    body = Jason.encode!(
      %{
        :client_id => client_id,
        :client_secret => client_secret,
        :code => code
      }
    )
    response = HTTPoison.post(
      "https://github.com/login/oauth/access_token",
      body,
      [{"Content-Type", "application/json"}]
    )
    case response do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        %{"access_token" => token} = Jason.decode!(body)
        {:ok, token}
      _ -> {:error}
    end
  end
end
