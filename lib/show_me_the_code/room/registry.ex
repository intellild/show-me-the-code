defmodule ShowMeTheCode.Room.Registry do
  use DynamicSupervisor

  alias ShowMeTheCode.Room.State
  alias ShowMeTheCodeWeb.Endpoint

  def start_link(init_arg) do
    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    :ets.new(__MODULE__, [:public, :named_table])
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def open(id, owner_id) do
    {:ok, pid} = DynamicSupervisor.start_child(__MODULE__, State)
    if :ets.insert_new(__MODULE__, {id, owner_id, pid}) do
      State.grant(pid, owner_id)
      :ok
    else
      DynamicSupervisor.stop(__MODULE__, pid)
      Utils.error(:already_exist)
    end
  end

  def get_owner(id) do
    case :ets.lookup(__MODULE__, id) do
      [{_, owner_id, _}] -> owner_id
      _ -> nil
    end
  end

  def grant(id, user_id) do
    case :ets.lookup(__MODULE__, id) do
      [{_, _, pid}] -> State.grant(pid, user_id)
      _ -> Utils.error(:not_exist)
    end
  end

  def join(id, user_id) do
    case :ets.lookup(__MODULE__, id) do
      [{_, _, pid}] -> State.join(pid, user_id)
      _ -> Utils.error(:not_exist)
    end
  end

  def close(id) do
    case :ets.lookup(__MODULE__, id) do
      [{_, _, pid}] ->
        :ets.delete(__MODULE__, id)
        :ok = State.stopping(pid)
        Endpoint.broadcast("room:#{id}", "shutdown", %{:reason => :room_empty})
        DynamicSupervisor.terminate_child(__MODULE__, pid)
      _ -> {}
    end
  end
end
