import assert from "node:assert/strict";
import { test } from "node:test";
import { guardPlayable, hasCompletionSignal } from "./text.mjs";

const COMPLETION = [
  "The entire game is playable on a real Switch, but the port is not finished",
  "can be beaten",
  "fully completable",
  "from beginning to end",
  "played start to finish",
  "fully playable end to end",
  "100%",
  "played through to the credits",
  "dá para zerar",
  "do início ao fim",
  "do começo ao fim",
  "o jogo inteiro",
  "the whole game is playable",
  "the full game",
  "can be finished",
  "can be completed",
  "has been beaten",
];

const NOT_COMPLETION = [
  "Playable from boot to races, story mode and 4-player Free Race, with sound.",
  "Playable from boot to races, story mode and 4-player Free Race, with sound, on both platforms.",
  "Version 0.1.5 is playable, and it is still a test build. The story mode and fights play on a real console;",
  "Play the Xbox 360 version of LEGO Star Wars: The Complete Saga on your Nintendo Switch, as homebrew: the story, two-player co-op and saves.",
  "It runs at 60 fps.",
  "Full speed docked: 59-60 fps at 98-99.8 % game speed in the measured levels, docked with the CPU at 1785 MHz",
  "A Nintendo Switch homebrew port (.nro) of Bomberman 64: Recompiled.",
  "the whole game is compiled to AArch64 code",
  "you need the full game files",
  "not checked through the whole game",
  "a full play-through has not been verified",
  "v1.0 = the whole game plays like the GameCube original",
  "Whole game playable | 90 %",
  "Credits - Switch 2 poster artwork",
  "messages and credits (accented letters are added to the game's font)",
  "playable",
  "jogável",
];

test("completion signals are the phrases that say the game can be finished", () => {
  for (const quote of COMPLETION) assert.equal(hasCompletionSignal(quote), true, quote);
  for (const quote of NOT_COMPLETION) assert.equal(hasCompletionSignal(quote), false, quote);
});

test("a new playable tier without a completion signal drops to ingame", () => {
  const races = "Playable from boot to races, story mode and 4-player Free Race, with sound.";
  assert.equal(guardPlayable("playable", races), "ingame");
  assert.equal(guardPlayable("playable", "Version 0.1.5 is playable, and it is still a test build"), "ingame");
  assert.equal(guardPlayable("playable", "It runs at 60 fps."), "ingame");
  assert.equal(guardPlayable("playable", null), "ingame");
});

test("a quote that says the game can be finished stays playable", () => {
  const alice = "The entire game is playable on a real Switch, but the port is not finished";
  assert.equal(guardPlayable("playable", alice), "playable");
  assert.equal(guardPlayable("playable", alice, "ingame"), "playable");
  assert.equal(guardPlayable("playable", "do início ao fim", "wip"), "playable");
});

test("review never upgrades a tier to playable without a completion signal", () => {
  const races = "Playable from boot to races, story mode and 4-player Free Race, with sound.";
  assert.equal(guardPlayable("playable", races, "ingame"), "ingame");
  assert.equal(guardPlayable("playable", races, "intro"), "intro");
  assert.equal(guardPlayable("playable", races, "wip"), "wip");
  assert.equal(guardPlayable("playable", races, "unrated"), "unrated");
  // The quote no longer supports the old playable tier, so it drops instead of staying.
  assert.equal(guardPlayable("playable", races, "playable"), "ingame");
});

test("other proposed tiers pass through", () => {
  assert.equal(guardPlayable("ingame", "It runs at 60 fps.", "wip"), "ingame");
  assert.equal(guardPlayable("unrated", "The entire game is playable", "playable"), "unrated");
  assert.equal(guardPlayable("wip", "can be beaten"), "wip");
});
