defmodule ShowMeTheCodeWeb.UserChannel do
  use Phoenix.Channel

  intercept ["join.response"]

  alias ShowMeTheCodeWeb.Endpoint
  alias ShowMeTheCode.Room
  alias ShowMeTheCode.User

  def join("user:" <> user_id, _payload, socket) do
    if Integer.to_string(socket.assigns.user_id) == user_id do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, Utils.error(:unauthorized)}
    end
  end

  def handle_info(:after_join, socket) do
    user_id = socket.assigns.user_id
    User.Presence.track(socket, user_id, %{:user_id => user_id})
    {:noreply, socket}
  end

  def handle_in("open", %{"id" => id}, socket) do
    {:reply, Room.Registry.open(id, socket.assigns.user_id), socket}
  end

  def handle_in("join.response", %{"user_id" => user_id, "accept" => accept, "room_id" => room_id}, socket) do
    Endpoint.broadcast("user:#{user_id}", "join.response", %{:accept => accept, :room_id => room_id})
    {:reply, :ok, socket}
  end

  def handle_in("join.request", %{"id" => id}, socket) do
    owner = Room.Registry.get_owner(id)
    owner_channel = "user:#{owner}"
    cond do
      owner == nil -> {:reply, Utils.error(:not_exist), socket}
      map_size(User.Presence.list(owner_channel)) != 0 ->
        Endpoint.broadcast(owner_channel, "join.request", %{:user_id => socket.assigns.user_id})
        {:reply, :ok, socket}
      true -> {:reply, Utils.error(:unknown), socket}
    end
  end

  def handle_out("join.response", %{:accept => accept, :room_id => room_id}, socket) do
    if accept do
      Room.Registry.grant(room_id, socket.assigns.user_id)
    end
    push(socket, "join.response", %{:accept => accept})
    {:noreply, socket}
  end
end