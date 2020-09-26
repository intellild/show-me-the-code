# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :show_me_the_code,
  ecto_repos: [ShowMeTheCode.Repo]

github_client_id =
  System.get_env("GITHUB_CLIENT_ID") ||
    raise """
    environment variable GITHUB_CLIENT_ID is missing.
    """

github_client_secret =
  System.get_env("GITHUB_CLIENT_SECRET") ||
    raise """
    environment variable GITHUB_CLIENT_SECRET is missing.
    """

# Configures the endpoint
config :show_me_the_code, ShowMeTheCodeWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "NrstlVMR87dp0qpxK2Os/ZIoTO0NYA7MnOcePjlcqB9GXNVR3ppx6sQRrknvPNv2",
  render_errors: [view: ShowMeTheCodeWeb.ErrorView, accepts: ~w(html json)],
  pubsub_server: ShowMeTheCode.PubSub,
  github_client_id: github_client_id,
  github_client_secret: github_client_secret

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
