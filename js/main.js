document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       共通BGM改良版
    ========================= */
    const bgm = new Audio("sounds/bgm.mp3");
    bgm.loop = true;
    bgm.volume = 0.1;

    let bgmPlaying = false;
    let bgmInitialized = false;

    const bgmToggle = document.createElement("button");
    bgmToggle.id = "bgm-toggle";
    bgmToggle.className = "bgm-toggle off";
    bgmToggle.textContent = "🔈 BGM OFF";
    document.body.appendChild(bgmToggle);

    function tryPlayBGM() {
        if (!bgmInitialized) {
            bgm.play().then(() => {
                bgmPlaying = true;
                bgmToggle.textContent = "🔊 BGM ON";
                bgmToggle.classList.remove("off");
            }).catch(e => {
                console.warn("BGM再生失敗:", e);
            });
            bgmInitialized = true;
        }
    }

    document.addEventListener("click", tryPlayBGM, { once: true });
    document.addEventListener("keydown", tryPlayBGM, { once: true });

    bgmToggle.addEventListener("click", () => {
        if (!bgmInitialized) {
            tryPlayBGM();
            return;
        }
        if (bgmPlaying) {
            bgm.pause();
            bgmPlaying = false;
            bgmToggle.textContent = "🔈 BGM OFF";
            bgmToggle.classList.add("off");
        } else {
            bgm.play().then(() => {
                bgmPlaying = true;
                bgmToggle.textContent = "🔊 BGM ON";
                bgmToggle.classList.remove("off");
            }).catch(e => console.warn("BGM再生失敗:", e));
        }
    });

    /* =========================
       fade-in オブザーバー
    ========================= */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-in-on-scroll").forEach(el => observer.observe(el));

    /* =========================
       キャラクターデータ
    ========================= */
    const charactersData = {
        protagonists: [
            { id: "lionel", name: "ライオネル", role: "光の勇者", cv: "神崎 優斗", image: "images/characters/yusya.png", desc: "世界を救った英雄の一人でリーダー的存在。温厚で誠実な青年。普段は誰に対しても穏やかに接し、争いを好まない。しかし戦場に立つと、迷わず仲間の安全を最優先に行動する頼れる英雄。光の力を宿し、仲間たちを守るためなら自らの危険も顧みないその姿は、多くの人々に希望と信頼を与える。アイズとは幼馴染で、同じ街で育った。" },
            { id: "airis", name: "アイズ", role: "剣姫", cv: "あいりす。", image: "images/characters/airis.png", desc: "「剣姫」の二つ名で呼ばれ、閃光のような剣技を持つ女剣士。いつも笑顔を絶やさず、勇者一行のムードメーカーとして明るく場を和ませる存在。仲間想いで、どんな困難にも前向きに立ち向かう姿は、多くの人々に希望と勇気を与える。ライオネルとは幼馴染で、同じ街で育った。" },
            { id: "karion", name: "カリオン", role: "万象の大賢者", cv: "早瀬 壮太", image: "images/characters/karion.png", desc: "魔法界ではその名を知らぬ者はいない大賢者。聖魔法と闇魔法の両方を操る稀有な才能を持ち、知識と実力を兼ね備えた存在。ライオネルにその力を見込まれ、勇者一行に加わり、旅路で知恵と魔法の力を仲間たちに与え続ける。" },
            { id: "raven", name: "レイブン", role: "桜眼の狙撃手", cv: "朝倉 凪", image: "images/characters/sara.png", desc: "元々は無所属の傭兵として名を馳せた孤高の狙撃手。その銃弾は百発百中で、狙撃時に瞳が桜色に輝くことから「桜眼の狙撃手」と呼ばれる。冷静沈着で任務に迷いはなく、仲間を守るためなら孤独な戦場でもひたすら標的を射抜く。" },
            { id: "zenon", name: "ゼノン", role: "禁忌の錬金術師", cv: "鈴木 悠真", image: "images/characters/zenon.png", desc: "古代に禁忌とされた呪いの錬金術すら操ることのできる稀代の錬金術師。好奇心旺盛で、常に新たな知識と可能性を求める冒険者でもある。かつて禁忌錬金に手を染めたことから牢獄に幽閉されていた過去を持ち、自身の知識欲を満たすために勇者一行とともに旅をしていた。自由奔放な性格。" },
            { id: "nox", name: "ノクス", role: "宵闇の暗殺者", cv: "中村 涼", image: "images/characters/nox.png", desc: "宵闇に現れる漆黒の暗殺者。報酬さえ得られればどんな任務も冷徹に遂行する冷静さを持つ。かつて魔族から依頼されたライオネル暗殺に失敗したことで、彼の強さの根源に強い興味を抱き、以来その力を知るために共に旅をすることとなった。影のように静かでありながら、仲間の旅路に思わぬ影響を与える存在。同じ暗殺者としてシンゲツをライバル視している。" },
            { id: "shuffle", name: "シャッフル", role: "千変万化", cv: "藤原 亮", image: "images/characters/sya.png", desc: "トランプカードを自在に操る天才変幻師。名前の通り姿も性格も千変万化で、誰も本心を掴めない。賭け事が大好きで、勇者一行に対してもイカサマを仕掛けることをためらわない。特にポーカーとブラックジャックの腕前は群を抜き、戦闘でもカードを武器にあらゆる策略を繰り出す、掴みどころのない自由奔放な存在。真面目な性格のライオネルとは、あまり仲が良くない。" },
            { id: "agnis", name: "アグニス", role: "紅蓮の剣士", cv: "松本 大輝", image: "images/characters/agu.png", desc: "剣に炎を纏い戦う実力派剣士。己の力を試すことが何よりも好きで、道場破りでは一度も敗れたことがない。ある日、勇者一行に勧誘に来たライオネルを道場破りと勘違いして迎え撃つが、初めて敗北を経験。その正々堂々たる生き様に惹かれ、ライオネルとともに旅に出ることとなる。実力は折り紙付きだが、ノクスやレイブン、シンゲツとは正々堂々主義ゆえにウマが合わないことも。" },
            { id: "shingetsu", name: "シンゲツ", role: "月鬼の暗殺者", cv: "佐藤 拓真", image: "images/characters/sin.png", desc: "月夜に現れる暗殺者。その姿を直接見た者はなく、「月夜の鬼（月鬼）」として恐れられていた。ノクスとは異なり、正義の名のもとに弱き者を守る依頼しか請け負わない孤高の暗殺者。貧困に苦しむ人々を助けられるならばと、ライオネル一行に加わる。正義感ゆえにノクスとは主義の違いから衝突することも多い。" },
            { id: "arceus", name: "アルセウス", role: "深淵の魔導士", cv: "高橋 翔太", image: "images/characters/aru.png", desc: "深淵の魔法に精通した魔導士。魔力量はカリオンに劣るものの、闇魔法の実力は彼を凌ぐ。深淵の魔法の奥深さに魅せられ、魔族の魔法にも興味を持つ。魔王討伐を目指すライオネルと共に旅をすることで、さらなる深淵の境地に到達できるのではないかと考えている。聖魔法を嫌悪しており、カリオンの存在には複雑な感情を抱く。" },
            { id: "hakuron", name: "ハクロン", role: "光と闇の舞い手", cv: "木村 航", image: "images/characters/haku.png", desc: "一刀流を極めし剣士。かつては帝国に仕える第一帝国騎士団筆頭団長として名を馳せ、帝国随一の剣の実力者と称えられていた男。「疾風」の二つ名の通り、その剣速と体術は常人の目では捉えきれず、戦場を駆け抜ける姿はまさに嵐の如し。彼が持つ最大の異質さは、聖なる力を宿す聖白刀と、邪悪なる力を宿す暗黒刀――相反する二属性を併せ持つアーティファクトの刀を、唯一扱える存在であるという。「彼がその刀を抜いた時、すでに戦いは終わっている」そう語られるほど、その剣は静かに、そして確実に敵を殲滅する。" }
        ],
        enemy: { id: "enemy_ais", name: "アイズ", role: "裏切りの剣姫", cv: "？？？？？", image: "images/characters/ais.png", desc: "かつて「剣姫」と称され、勇者ライオネルと共に世界を救った英雄の一人。閃光のごとき剣技と、常に仲間を想う優しさで、勇者一行の中心的存在だった。しかし、魔王を討ち果たしたその瞬間――世界の“真理”が、ただ一人アイズの内に流れ込む。救われたはずの世界が、決して正義ではないこと。犠牲と欺瞞の上に成り立つ歪んだ秩序であること。そのすべてを悟った彼女の心は、希望と共に深い闇へと堕ちていった。「この世界は、救う価値などない……ならば、破壊して新たな秩序を築くまでだ」仲間たちの目の前でそう言い放ち、アイズは剣を振るう。かつて守るために振るった剣は、今や世界を断罪する刃へと変わった。元英雄にして、最大の敵。剣姫アイズは、世界そのものを裁くため、勇者一行の前に立ちはだかる。" }
    };

    /* =========================
       インフォメーションデータ（トップページ専用）
    ========================= */
    const infoData = [
        { id: "update1", title: "公式ウェブサイト公開", date: "2026-01-24", desc: "公式ウェブサイトが公開されました。" },
        { id: "update2", title: "PV公開", date: "2026-01-24", desc: "最新PVがサイトで視聴可能になりました。" },
        { id: "update3", title: "遊技機開発決定！", date: "2026-01-24", desc: "Rҽ:UNioNがパチンコになって登場？！鋭意開発中。" }
    ];

    /* =========================
       ページ判定
    ========================= */
    const isCharacterPage = !!document.getElementById("character-name");

    /* =========================
       ボス演出
    ========================= */
    window.activateBossMode = function () {
        document.body.classList.add("boss-mode");
        const veil = document.createElement("div");
        veil.className = "boss-veil";
        document.body.appendChild(veil);
        setTimeout(() => { veil.style.opacity = 1; }, 50);
    }

    /* =========================
       キャラクター詳細ページ描画
    ========================= */
    if (isCharacterPage) {
        const params = new URLSearchParams(location.search);
        const id = params.get("id");
        const allCharacters = [...charactersData.protagonists, charactersData.enemy];
        const char = allCharacters.find(c => c.id === id);

        if (!char) {
            document.getElementById("character-name").textContent = "NOT FOUND";
            document.getElementById("character-desc").textContent = "キャラクター情報が見つかりません。";
        } else {
            document.title = `${char.name} | CHARACTER | Rҽ:UNioN`;
            document.getElementById("character-name").textContent = char.name;
            document.getElementById("character-role").textContent = char.role;
            document.getElementById("character-cv").textContent = `CV: ${char.cv}`;
            document.getElementById("character-desc").textContent = char.desc;
            const imageContainer = document.getElementById("character-image");
            imageContainer.style.backgroundImage = `url('${char.image}')`;

            // ★アイズ用 overlay 追加
            if (char.id === "airis") {
                const overlay = document.createElement("div");
                overlay.className = "overlay-image";
                overlay.innerHTML = `<img src="images/batu.png" alt="アイズの装飾">`;
                imageContainer.appendChild(overlay);
            }

            if (char.id === "enemy_ais") window.activateBossMode();
        }
    }

    /* =========================
       PVクリック再生
    ========================= */
    const videoContainer = document.getElementById("video-container");
    const videoPlaceholder = document.getElementById("video-placeholder");

    if (videoContainer && videoPlaceholder) {
        videoPlaceholder.addEventListener("click", () => {

            /* ★ PV再生時にBGMを停止 */
            if (bgmPlaying) {
                bgm.pause();
                bgmPlaying = false;
                bgmToggle.textContent = "🔈 BGM OFF";
                bgmToggle.classList.add("off");
            }

            const video = document.createElement("video");
            video.src = "videos/pv.mp4";
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.style.width = "100%";
            video.style.height = "100%";

            videoContainer.innerHTML = "";
            videoContainer.appendChild(video);

            video.play().catch(e => console.warn("PV再生エラー:", e));

            const soundButton = document.createElement("button");
            soundButton.id = "pv-sound-toggle";
            soundButton.textContent = "🔊 音声ON";
            soundButton.style.position = "absolute";
            soundButton.style.top = "10px";
            soundButton.style.right = "10px";
            soundButton.style.zIndex = "10";
            videoContainer.appendChild(soundButton);

            soundButton.addEventListener("click", () => {
                video.muted = !video.muted;
                soundButton.textContent = video.muted ? "🔇 ミュート" : "🔊 音声ON";
            });
        });
    }

    /* =========================
       トップページキャラクター描画 & インフォメーション欄
    ========================= */
    if (!isCharacterPage) {

        // キャラクター描画
        const grid = document.getElementById("protagonist-grid");
        if (grid) {
            charactersData.protagonists.forEach(char => {
                const card = document.createElement("div");
                card.className = "character-card fade-in-on-scroll";

                // innerHTMLで基本構造を作る
                card.innerHTML = `
        <div class="char-img" style="background-image:url('${char.image}')"></div>
        <div class="char-name">${char.name}</div>
        <div class="char-role">${char.role}</div>
        <div class="char-cv">CV: ${char.cv}</div>
    `;

                // アイズだけにクラス追加＆オーバーレイ追加
                if (char.id === "airis") {
                    card.classList.add("aze");
                    const overlay = document.createElement("div");
                    overlay.className = "overlay-image";
                    overlay.innerHTML = `<img src="images/batu.png" alt="アイズの装飾">`;
                    card.appendChild(overlay);
                }

                card.addEventListener("click", () => location.href = `character.html?id=${char.id}`);
                grid.appendChild(card);
                observer.observe(card);
            });
        }

        const wrap = document.getElementById("enemy-wrapper");
        if (wrap) {
            const enemy = charactersData.enemy;
            const card = document.createElement("div");
            card.className = "enemy-card fade-in-on-scroll";
            card.innerHTML = `
                <div class="char-img enemy-img" style="background-image:url('${enemy.image}')"></div>
                <div class="char-name">${enemy.name}</div>
                <div class="char-role">${enemy.role}</div>
                <div class="char-cv">CV: ${enemy.cv}</div>
                <p class="enemy-desc">${enemy.desc}</p>
            `;
            wrap.appendChild(card);
            observer.observe(card);
        }

        // インフォメーション欄描画
        const infoContainer = document.getElementById("info-list");
        if (infoContainer) {
            infoData.forEach(info => {
                const card = document.createElement("div");
                card.className = "info-card fade-in-on-scroll";
                card.innerHTML = `
                    <div class="info-date">${info.date}</div>
                    <div class="info-title">${info.title}</div>
                    <div class="info-desc">${info.desc}</div>
                `;
                infoContainer.appendChild(card);
                observer.observe(card);
            });
        }
    }

});


