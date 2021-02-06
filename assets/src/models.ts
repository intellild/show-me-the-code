import { ListGists_viewer_gists_nodes, ListGists_viewer_gists_nodes_files } from "./services/__generated__/ListGists";
import { User_viewer } from "./services/__generated__/User";

export type IGist = ListGists_viewer_gists_nodes;

export type IGistFile = ListGists_viewer_gists_nodes_files;

export type IUser = User_viewer;
