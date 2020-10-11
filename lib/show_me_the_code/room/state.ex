defmodule ShowMeTheCode.Room.State do
  use Agent

  def start_link(_opts) do
    Agent.start_link(fn -> {:running, MapSet.new(), [0, 1, 2, 3, 4]} end)
  end

  def join(s, user_id) do
    get_and_update(
      s,
      fn {:running, granted, slots} ->
        if MapSet.member?(granted, user_id) do
          case slots do
            [slot | rest] -> {{:ok, slot}, {:running, granted, rest}}
            _ -> {{:error, :full}, state}
          end
        else
          {{:error, :unauthorized}, state}
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

  defp get_and_update(s, f) do
    Agent.get_and_update(
      s,
      fn state ->
        case state do
          {:stopping, _, _} -> {{:error, :stopping}, state}
          _ -> f(state)
        end
      end
    )
  end
end
