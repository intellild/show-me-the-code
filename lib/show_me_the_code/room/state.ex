defmodule ShowMeTheCode.Room.State do
  use Agent

  def start_link(_opts) do
    Agent.start_link(fn -> {:running, MapSet.new(), [0, 1, 2, 3, 4]} end)
  end

  def join(s, user_id) do
    Agent.get_and_update(
      s,
      fn state ->
        case state do
          {:stopping, _, _} -> {{:error, :stopping}, state}
          {_, _, []} -> {{:error, :room_full}, state}
          {status, granted, [slot | rest]} ->
            if MapSet.member?(granted, user_id) do
              {{:ok, slot}, {status, granted, rest}}
            else
              {{:error, :unauthorized}, state}
            end
        end
      end
    )
  end

  def grant(s, user_id) do
    Agent.update(s, fn {status, granted, slots} -> {status, MapSet.put(granted, user_id), slots} end)
  end

  def leave(s, slot) do
    Agent.update(s, fn {status, granted, slots} -> {status, granted, [slot | slots]}  end)
  end

  def stopping(s) do
    Agent.update(s, fn {_, granted, slots} -> {:stopping, granted, slots} end)
  end
end
