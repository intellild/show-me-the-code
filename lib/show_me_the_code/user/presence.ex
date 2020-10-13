defmodule ShowMeTheCode.User.Presence do
  use Phoenix.Presence, otp_app: :show_me_the_code, pubsub_server: ShowMeTheCode.PubSub
end
