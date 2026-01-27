import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchOGEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 100" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">FPS</div>
                            <p>{{ level.fps || 'Any' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 100"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 100"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    <template v-if="ogeditors">
                        <h3>OG List Editors</h3>
                        <ol class="ogeditors">
                            <li v-for="editor in ogeditors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Information</h3>
                    <p>
                        This is the Micro Click Challenge List (MCCL) for the game Geometry Dash. This list ranks the top 100 hardest micro-click challenges in the game, focusing on levels that demand extremely precise, short-duration inputs and near-perfect timing.
                    </p>
                    <p>
                        In Geometry Dash, a micro-click does not refer to click strength or pressure. Instead, it describes a very brief tap that is released within a tight frame window. Because the game’s input system is binary—pressed or released—these challenges test a player’s click control, consistency, and timing accuracy, often down to a single frame.
                    </p>
                    <p>
                        Micro-click challenges are especially demanding due to the game’s frame-based physics, where holding or releasing input for even one extra frame can dramatically change gameplay. This makes micro-clicks critical in game modes such as cube, ship, UFO, and wave, where slight differences in input duration can determine success or failure.
                    </p>
                    <p>
                        The challenges on this list are designed to push the limits of human precision, requiring players to master short taps, rapid input control, and intense focus. Difficulty is based on factors such as input tightness, consistency requirements, gameplay speed, and overall execution difficulty.
                    </p>
                    <p>
                        This list exists to document, rank, and celebrate some of the most mechanically demanding micro-click challenges ever created in Geometry Dash.
                    </p>
                    <p>
                        Additionally, this is version two of the list, introduced alongside updated rules and standards to better reflect modern micro-click challenges.
                    </p>
                    <p>
                        Special credit goes to pixelfactorial for reviving the Micro Click Challenge List after it had been inactive for approximately four years. After a long period without updates, the list had effectively been discontinued. As an original moderator, pixelfactorial played a major role in bringing it back, rebuilding its structure, and renewing interest in micro-click challenges within the Geometry Dash community. Their work helped preserve the list’s history while allowing it to continue evolving with modern challenges and updated standards.
                    </p>
                    <p>
                        MCCL is a fan-made project and is not affiliated with, endorsed by, or associated with RobTopGames AB® in any way, similar to other community-run lists.
                    </p>
                    </template>
                    <h3>Submission Requirements</h3>
                    <p>
                        - Achieved the record without using hacks (anything up to 360 FPS is allowed including Physics Bypass, any usage of CBF is banned)
                    </p>
                    <p>
                        - Achieved the record on the level that is listed on the site - please check the level ID before you submit a record
                    </p>
                    <p>
                        - Have either source audio or clicks/taps in the video. Edited audio only does not count
                    </p>
                    <p>
                        - The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt. Everyplay records are exempt from this
                    </p>
                    <p>
                        - The recording must also show the player hit the endwall, or the completion will be invalidated.
                    </p>
                    <p>
                        - Any form of hardware abuse is not allowed for swiftclick challenges
                    </p>
                    <p>
                        - Once a level falls onto the Legacy List, we no longer accept the records for them.
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        ogeditors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();
        this.ogeditors = await fetchOGEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.")
            }
            if (!this.ogeditors) {
                this.errors.push("Failed to load OG list editors.")
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
