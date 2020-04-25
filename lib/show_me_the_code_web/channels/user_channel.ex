defmodule ShowMeTheCodeWeb.UserChannel do
  use Phoenix.Channel

  def join("user:" <> user_id, _payload, socket) do
    {:ok, %{}, socket}
  end

end