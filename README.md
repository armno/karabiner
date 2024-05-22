# Karabiner Elements configuration

Based on [@mxstbr's configurations and setup](https://github.com/mxstbr/karabiner).

## Installation

1. Install & start [Karabiner Elements](https://karabiner-elements.pqrs.org/)
1. Clone this repository
1. Delete the default `~/.config/karabiner` folder
1. Create a symlink with `ln -s ~/code/karabiner ~/.config` (where `~/code/karabiner` is your local path to where you cloned the repository)
1. [Restart karabiner_console_user_server](https://karabiner-elements.pqrs.org/docs/manual/misc/configuration-file-path/) with `` launchctl kickstart -k gui/`id -u`/org.pqrs.karabiner.karabiner_console_user_server ``

## Development

```sh
corepack enable # make yarn available
# then
yarn install
yarn run build
# or
yarn run watch
```

## License

Copyright (c) 2022 Maximilian Stoiber, licensed under the [MIT license](./LICENSE.md).
