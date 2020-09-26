defmodule ShowMeTheCodeWeb.UserChannel do
  use Phoenix.Channel

  def join("user:" <> user_id, _payload, socket) do
    if Integer.to_string(socket.assigns.user_id) == user_id do
      {:ok, socket}
    else
      {:error, "Not Authorized"}
    end
  end

end