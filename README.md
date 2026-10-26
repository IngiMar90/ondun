# Öndun

Létt íslenskt öndunarforrit fyrir skóladaginn, án innskráningar, auglýsinga, utanaðkomandi leturs eða gagnasöfnunar.

- Kassaöndun: 4 sekúndur inn, halda 4, út 4, halda 4. Punktur fylgir hliðum kassans réttsælis.
- Jöfn öndun: 4 sekúndur inn og 4 út. Blaðra stækkar og minnkar með önduninni.
- Hreinn, jafn sínustónn við innöndun (220 Hz) og lægri við útöndun (196 Hz), án yfirtóna, púlsunar eða sveiflna í styrk. Hver tónn heyrist í allar fjórar sekúndur inn- eða útöndunar með 150 ms mjúkri byrjun og 120 ms mjúkum enda til að forðast smelli; algjör þögn í öndunarhléum. Hljóðmerki eru sjálfvalin en má slökkva á valskjá. Sjálfgefinn hljóðstyrkur er 20% og nýi tónninn er um 20 dB lægri að styrk en fyrri útgáfa við sömu kerfisstillingu. Styrk má stilla frá 0–100% og heyra bæði tónana með Prófa hljóð; valið vistast í tækinu. Sýnishorn má stöðva strax; það hættir líka þegar farið er yfir í æfingu eða flipi er falinn. Tónarnir eru búnir til staðbundið með Web Audio og virka án nets. Hljóð og mynd nota sömu klukku. Hljóð stöðvast við Enda, lok tíma, bakktakka og falinn flipa. Þegar haldið er áfram í miðju öndunarskrefi heldur tónninn áfram frá sama stað.
- Lengd 1–5 mínútur; síðasta val vistast aðeins í tækinu.
- Eftir Byrja birtist hljóðlaus 3–2–1 niðurtalning fyrir ofan formið. Formið stendur kyrrt þar til henni lýkur. Æfingatíminn 1–5 mínútur byrjar eftir niðurtalningu. Enda eða bakktakki hættir einnig við niðurtalningu; falinn flipi setur hana í hlé.
- Fyrsti skjár: velja æfingu og tíma, síðan Áfram.
- Æfingaskjár (#aefing): aðeins öndunarform, stutt leiðsögn um núverandi skref og lítill Byrja-hnappur í neðra hægra horni. Eftir upphaf er Enda eini hnappurinn.
- Enginn tímamælir, talning, framvinduslá, fyrirsögn eða valmynd á æfingaskjá.
- Enda skilar á valið. Við tímamörk stöðvast æfingin með textanum „Æfingu lokið“ og nemandinn velur sjálfur hvenær hann fer til baka.
- Æfing stöðvast tímabundið þegar flipi er falinn og heldur áfram þegar komið er til baka. Bakktakki vafra fer af æfingaskjá og stöðvar tímann.
- Uppsetjanlegt PWA með staðbundnum táknum og þjónustuþræði fyrir notkun án nets eftir fyrstu vistun.
- Kerfisstilling fyrir minni hreyfingu stöðvar stækkun blöðrunnar; stutt leiðsögn um innöndun og útöndun helst sýnileg.

## Keyra staðbundið

```sh
python3 -m http.server 8000
```

Opnaðu http://localhost:8000. Engin uppsetning pakka eða bygging nauðsynleg.

```sh
npm test
```

## Hýsa á GitHub Pages

Í Settings → Pages → Build and deployment, veldu **Deploy from a branch**, grein **main**, möppu **/(root)** og Save. Vefslóðin verður https://ingimar90.github.io/ondun/ þegar Pages hefur birt síðuna. Engin GitHub Actions-vinnslurás er nauðsynleg.

Opnaðu síðuna í Chrome/Edge á Chromebook, Windows eða Android og veldu **Setja upp app**. Á iPhone/iPad: Safari → Deila → Bæta á heimaskjá. Stýrð skólatæki geta haft takmarkanir á uppsetningu. HTTPS eða localhost þarf fyrir þjónustuþráð. Offline-virkni er tilbúin þegar fyrsta opnun hefur náð að vista skrárnar.

## Heilskjár

Uppsetta appið óskar eftir fullscreen við opnun í manifest.webmanifest. Stuðningur fer eftir vafra og stýrikerfi; annars notar vafrinn standalone eða næsta studda ham. Þegar ýtt er á Áfram eða Byrja óskar appið einnig eftir heilskjá með Fullscreen API ef það er stutt. Enginn aukahnappur er á æfingaskjánum og synjun stöðvar ekki æfinguna. Esc getur lokað heilskjá; appið þvingar notandann ekki aftur í hann án nýs smells. Enda fer aftur á valið og heldur heilskjánum.

Eldri uppsetningar geta þurft að vera lokaðar og opnaðar aftur eftir uppfærslu. Vafrinn stjórnar hvenær nýjar manifest-stillingar taka gildi; ef þær festast í gömlum ham má setja appið upp aftur.

## Viðhald

Við breytingar á skrám skal hækka CACHE-heitið í sw.js. Ný útgáfa tekur við þegar eldri opnum gluggum er lokað og appið opnað aftur. Allar slóðir eru afstæðar og virka undir /ondun/.

## Notkun með nemendum

Öndun á að vera mjúk og þægileg. Nemendur mega anda eðlilega, sleppa öndunarhléum eða hætta. Ekki þrýsta á að klára tímann; hætta við svima eða vanlíðan. Æfingin á ekki að knýja fram mjög djúpa eða hraða öndun.

Bakgrunnurinn #DFEDE8 er mildur blágrænn. Litaval er hönnunarákvörðun, ekki fullyrðing um að einn litur rói alla.
