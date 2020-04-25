defmodule ShowMeTheCode.Repo.Migrations.AddRoomAlias do
  use Ecto.Migration

  def change do
    alter table(:room) do
      add :alias, :string, null: false
      add :type, :string, default: "public"
    end

    create unique_index("room", [:alias])
  end
end
