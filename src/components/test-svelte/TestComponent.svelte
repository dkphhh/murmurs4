<script lang="ts">
  import DataStorage from "./DataStorage.svelte";
  import DefaultBrowserAction from "./DefaultBrowserAction.svelte";
  import EventDelegation from "./EventDelegation.svelte";
  import EventPlayground0 from "./EventPlayground0.svelte";
  import EventPlayground1 from "./EventPlayground1.svelte";
  import EventPlayground2 from "./EventPlayground2.svelte";
  import EventPlayground3 from "./EventPlayground3.svelte";
  import FileRead from "./FileRead.svelte";
  import FlightBooker from "./FlightBooker.svelte";
  import KeyBoardEvent from "./KeyBoardEvent.svelte";
  import MouseEvents from "./MouseEvents.svelte";
  import ScrollEvent from "./ScrollEvent.svelte";
  import TemperatureConverter from "./TemperatureConverter.svelte";
  import Timer from "./Timer.svelte";
  import { setContext } from "svelte";

  const fruit = $state({
    name: "Apple",
    color: "Red",
    price: 1.2,
  });

  setContext("fruit", fruit);
</script>

<div class="flex w-full flex-col items-center justify-center gap-2 p-4">
  <div class="divider">Task - 2</div>
  <TemperatureConverter />

  <div class="divider">Task - 3</div>
  <FlightBooker />

  <div class="divider">Task - 4</div>
  <Timer />
  <div class={{ divider: true }}>Playground - 1</div>
  <EventPlayground0 />
  <EventPlayground1 />
  <EventPlayground2 />
  <EventPlayground3 />
  <div class={{ divider: true }}>Playground - 2</div>
  <EventDelegation />
  <DefaultBrowserAction />
  <MouseEvents />
  <KeyBoardEvent />
  <ScrollEvent />
  <div class={{ divider: true }}>Playground - 3</div>
  <FileRead />
  <DataStorage />
</div>
