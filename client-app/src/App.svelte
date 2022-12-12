<script lang="ts">
  import { summary, suitcase } from './assets/data.json';
  import travis from './assets/travis.png';
  import suit from './assets/suit.png';
  import travisThumb from './assets/thumbnail_travis.jpeg';
  import suitThumb from './assets/thumbnail_suit.jpeg';
  import InterviewOverview from './components/content/InterviewOverview.svelte';

  type SelectedTab = 'suitcase' | 'travis';

  let selectedTab: SelectedTab = 'suitcase';

  function selectTab(type: SelectedTab) {
    selectedTab = type;
  }
</script>

<main class="flex flex-col justify-center pt-2 pb-5 gap-5">
  <div class="flex justify-center">
    <div class="tabs">
      <button
        on:click={() => selectTab('suitcase')}
        class:tab-active={selectedTab === 'suitcase'}
        class="tab tab-bordered tab-lg">Suitcase interview</button
      >
      <button
        on:click={() => selectTab('travis')}
        class:tab-active={selectedTab === 'travis'}
        class="tab tab-bordered tab-lg">Travis murder</button
      >
    </div>
  </div>

  {#if selectedTab === 'suitcase'}
    <InterviewOverview
      title="Woman Promises on Son's Life that Flipping Suitcase with Man Inside Was Not Intentional: Police Interview'"
      summary={suitcase}
      highlightsThumbnail={suitThumb}
      keywords={suit}
    />
  {:else if selectedTab === 'travis'}
    <InterviewOverview
      title="Murder Suspect Denies Involvement Despite Evidence of Palm Print and Blood at Scene"
      {summary}
      highlightsThumbnail={travisThumb}
      keywords={travis}
    />
  {/if}
</main>
