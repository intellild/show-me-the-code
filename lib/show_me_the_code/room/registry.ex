defmodule ShowMeTheCode.Room.Registry do
  def init() do
    :ets.new(__MODULE__, [:public, :named_table])
  end

  def open(id, owner_id) do
    :ets.insert_new(__MODULE__, {id, owner_id})
  end

  def is_owner(id, user_id) do
    case :ets.lookup(__MODULE__, id) do
      [{_, owner_id}] -> owner_id == user_id
      _ -> false
    end
  end

  def get_owner(id) do
    case :ets.lookup(__MODULE__, id) do
      [{_, owner_id}] -> owner_id
      _ -> nil
    end
  end

  def delete(id) do
    :ets.delete(__MODULE__, id)
  end
end
