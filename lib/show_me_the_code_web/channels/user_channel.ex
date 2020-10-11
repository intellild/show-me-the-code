defmodule ShowMeTheCodeWeb.UserChannel do
  use Phoenix.Channel

  intercept ["join.response"]

  alias ShowMeTheCodeWeb.Endpoint
  alias ShowMeTheCode.Room.{Registry, Presence}
  alias ShowMeTheCode.User.State, as: UserState

  def join("user:" <> user_id, _payload, socket) do
    if Integer.to_string(socket.assigns.user_id) == user_id do
      {:ok, socket}
    else
      {:error, "Not Authorized"}
    end
  end

  def handle_in("open", %{"id" => id}, socket) do
    {:reply, Registry.open(id, socket.assigns.user_id), socket}
  end

  def handle_in("join.response", %{"user_id" => user_id, "accept" => accept, "room_id" => room_id}, socket) do
    Endpoint.broadcast("user:#{user_id}", "join.response", %{:accept => accept, :room_id => room_id})
    {:reply, :ok, socket}
  end

  def handle_in("join.request", %{"id" => id}, socket) do
    try do
      owner = Registry.get_owner(id)
      if owner == nil do
        throw :not_exist
      end
      owner_channel = "user:#{owner}"
      if map_size(Presence.list(owner_channel)) != 0 do
        Endpoint.broadcast(owner_channel, "join.request", %{:user_id => socket.assigns.user_id})
        throw :ok
      end
      Presence.list("user:#{owner}")
    catch
      :not_exist -> {:reply, {:error, :not_exist}, socket}
      :ok -> {:reply, :ok, socket}
    end
  end

  def handle_out("join.response", %{:accept => accept, :room_id => room_id}, socket) do
    if accept do
      UserState.grant_access(socket, room_id)
    end
    push(socket, "join.response", %{:accept => accept})
    {:noreply, socket}
  end
end