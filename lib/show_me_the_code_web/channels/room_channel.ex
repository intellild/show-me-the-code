defmodule ShowMeTheCodeWeb.RoomChannel do
  use Phoenix.Channel

  intercept ["shutdown"]

  alias ShowMeTheCode.Room.{Registry, Presence}

  def join("room:" <> room_id, _payload, socket) do
    result = Registry.join(room_id, socket.assigns.user_id)
    case result do
      {:ok, slot} ->
        send(self(), :after_join)
        {:ok, slot, socket}
      _ -> result
    end
  end

  def terminate(reason, socket) do
    case reason do
      {:shutdown, :room_empty} -> {}
      _ -> client_leave(socket)
    end

    {:ok, socket}
  end

  def handle_out("shutdown", reason, socket) do
    {:stop, {:shutdown, reason}, socket}
  end

  #  def handle_in(
  #        "sync.full.reply",
  #        %{"content" => content, "language" => language, "expires" => expires},
  #        socket
  #      ) do
  #    broadcast(socket, "sync.full", %{content: content, language: language, expires: expires})
  #    {:noreply, socket}
  #  end
  #
  #  def handle_in("user.edit", payload, socket) do
  #    broadcast_from(socket, "user.edit", Map.put(payload, "from", socket.assigns.id))
  #    {:noreply, socket}
  #  end
  #
  #  def handle_in("user.selection", payload, socket) do
  #    broadcast_from(socket, "user.selection", Map.put(payload, "from", socket.assigns.id))
  #    {:noreply, socket}
  #  end
  #
  #  def handle_in("user.cursor", payload, socket) do
  #    broadcast_from(socket, "user.cursor", Map.put(payload, "from", socket.assigns.id))
  #    {:noreply, socket}
  #  end
  #
  #  def handle_in("save", %{"content" => content, "language" => language}, socket) do
  #    {status, _} =
  #      %Room{id: socket.assigns.room_id}
  #      |> Room.changeset(%{content: content, language: language})
  #      |> Repo.update()
  #
  #    {:reply, status, socket}
  #  end

  def handle_info(:after_join, socket) do
    user_id = socket.assigns.user_id
    {:ok, _} = Presence.track(socket, user_id, %{:user_id => user_id})
    user_list = Presence.list(socket)
    push(socket, "presence_state", user_list)
    {:noreply, socket}
  end

  def handle_info({:sync_full_request, payload}, socket) do
    push(socket, "sync.full.request", payload)
    {:noreply, socket}
  end

  defp client_leave(socket) do
    list = Presence.list(socket)
    if map_size(list) == 0 do
      "room:" <> id = socket.topic
      Registry.close(id)
    end
  end

  #  defp send_to_user(user_id, payload, socket) do
  #    clients = Bucket.get_clients(socket.assigns.room)
  #    channel_pid = Map.get(clients, user_id)
  #
  #    if channel_pid != nil do
  #      send(channel_pid, payload)
  #      :ok
  #    else
  #      :error
  #    end
  #  end
end
