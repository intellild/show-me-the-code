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
  def connect(%{"token" => token}, socket, _connect_info) do
    client = Tentacat.Client.new(%{access_token: token})
    case Tentacat.Users.me(client) do
      {200, %{"id" => user_id}, _} ->
        state = ShowMeTheCode.User.State.start_link()
        {
          :ok,
          assign(
            socket,
            %{
              :user_id => user_id,
              :state => state
            }
          )
        }
      {_, %{"message" => message}, _} -> {:error, message}
      _ -> {:error, "unknown"}
    end
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
