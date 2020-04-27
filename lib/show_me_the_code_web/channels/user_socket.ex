defmodule ShowMeTheCodeWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "room:*", ShowMeTheCodeWeb.RoomChannel
  channel "user:*", ShowMeTheCodeWeb.UserChannel

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(%{"token" => token}, socket, _connect_info) when is_bitstring(token) do
    user_id = token
    socket = socket
             |> assign(:id, UUID.uuid4())
             |> assign(:user_id, user_id)
             |> assign(:username, token)
    {:ok, user_id, socket}
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     ShowMeTheCodeWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(socket), do: "user_socket:#{socket.assigns.user_id}"
end
