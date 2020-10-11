defmodule ShowMeTheCode.User.State do
  use Agent

  def start_link() do
    Agent.start_link(fn -> %{:granted => MapSet.new()} end)
  end

  def grant_access(socket, room_id) do
    Agent.update(
      socket.assigns.state,
      fn state ->
        %{state | :granted => MapSet.put(state.granted, room_id)}
      end
    )
  end

  def has_access(socket, room_id) do
    granted = Agent.get(socket.assigns.state, fn state -> state.granted end)
    MapSet.member?(granted, room_id)
  end
end
