<script lang="ts">
  import H1 from '../common/H1.svelte';
  import H3 from '../common/H3.svelte';
  import Section from './Section.svelte';

  export let title: string;
  export let summary: string;
  export let keywords: string;
  export let highlightsThumbnail: string;
  export let duration = '00:01:40';
</script>

<article class="flex flex-col mx-[300px] gap-3">
  <div
    class="flex flex-col gap-5 bg-base-300 rounded-lg border border-primary border-opacity-30 px-1 py-3"
  >
    <Section>
      <div>
        <H3 text={title} />
        <p>{summary}</p>
      </div>
    </Section>
    <div class="flex justify-center">
      <Section>
        <div>
          <H3 text="Keyword highlights" />
          <div class="self-center flex flex-col">
            <img
              src={highlightsThumbnail}
              alt="Keyword highlights"
              class="rounded-lg rounded-b-none"
            />
            <p
              class="bg-base-100 border border-primary border-opacity-40 text-white p-3 rounded-lg rounded-t-none border-t-0"
            >
              Duration: {duration}
            </p>
          </div>
        </div>
        <div class="shrink-0 pb-3">
          <H3 text="Keywords" />
          <img class="h-[400px] rounded-md" src={keywords} alt="Word cloud" />
        </div>
      </Section>
    </div>
  </div>
</article>
