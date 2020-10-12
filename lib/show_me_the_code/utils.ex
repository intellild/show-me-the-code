defmodule Utils do
  def error(reason) do
    {:error, %{ :reason => reason }}
  end
end
