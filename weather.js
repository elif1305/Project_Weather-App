const form = document.querySelector("section.top-banner form");  // submit butonunu yakalamak yerine form u yakalamak daha mantikli. form.submit ile otomatik islemleri yapabliriz. 2* enter butonu otomatık eklenıyor
const input = document.querySelector(".top-banner input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section .cities"); // classlar arasainda bosluk birakildigi zaman biiri kendi biri childi demek.

// localStorage.setItem("apiKey", EncryptStringAES("4d97b4ee9ef2e908406b6e1fab21e4a0"));  // sifreli olarak gonderiyoruz. gonderdikten sonra burada tutmaya gerek yok silebilirz.

form.addEventListener("submit", (e) =>{
    e.preventDefault();             // sayfayi otomatik yenilememesi icin
    getWeatherDataFromApi();
});

// function getWeatherDataFromApi(){}
const getWeatherDataFromApi = async() =>{
    // alert("http request gone");
    // input.value = "";  // form.reset ile ayni islemi yapar
    let tokenKey = DecryptStringAES(localStorage.getItem("apiKey"));   // sifrledigimiz Apikeyi cozerek aliyoruz.
    let inputVal = input.value;
    let unitType = "metric";   //! metric olduğunda fahrenayttan celciusa geçiyor
    let lang = "tr";             //! dil icin
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${tokenKey}&units=${unitType}`;
    // api linki openweaher.comdan alindi.


    try {
        // const response = await fetch.get(url).then(response => response.json());
        //axios.get(url) == axios(url)
        const response = await axios(url);            //! axios ile islem yapildiginda veri gonderilip alinirken ekstra islem (strinfy,parse gibi) yapilmasina gerek yoktur. axios bunu kendisi otomtik olarak json olarak islem yapar. axios bir kutuphanedir, pakettir, kulanmak icin cdn ile linkini htmle eklemek gerekir.
        const { name, main, sys, weather } = response.data;
        // console.log(response.data);
        let iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        //forEach => array + nodeList
        //map, filter, reduce => array

        //! bir aratilan sehrin tekrar cikmasini engellemek icin:
        const cityListItems = list.querySelectorAll(".city");
        const cityListItemsArray = Array.from(cityListItems);
        if(cityListItemsArray.length > 0){
            const filteredArray = cityListItemsArray.filter(cityCard => cityCard.querySelector("span").innerText == name);
            // console.log(cityListItemsArray.length);
            if(filteredArray.length > 0){
                msg.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
                setTimeout(()=>{      // yapilan uyari 5sn sonra kaybolmasi icin
                    msg.innerText = "";
                }, 5000);
                form.reset();    // inputa bir sehir ismi girildikten sonra inputu temizlemek icin form.reset yapilir. 
                return;
            }
        }
        // else{}   // hemen yukarida return kullandigimiz icin fonksiyondan cikisi sagladik bu nedenle else kullanmaya gerek kalmadi.

        //! li olarak aratilan sehirleri ekleme:
        const createdLi = document.createElement("li");
        createdLi.classList.add("city");
        const createdLiInnerHTML = 
            `<h2 class="city-name" data-name="${name}, ${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            
            <figure>                                                                    
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`;
        createdLi.innerHTML = createdLiInnerHTML;
 // FIGURE SEO ICIN ONEMLI BU NEDENLE FIGURE KULLANDIK.

        //append vs. prepend
        list.prepend(createdLi);
        // neden prepend kullanildi: eger append kullanilsaydi, ornegin ilk olarak bir sehri arattik, sonrasinda aratacagimiz sehri sonuna yani sagina eklenirdi.fakat prepend ile kullandigimizda her bir yei aratilan sehri sona (saga) degil basa ekler.Bu nedenle prepend kullandik.
    } 
    catch (error) {
        msg.innerText = error;
        setTimeout(()=>{                // hatayi kullaniciya gosterdikten 5 sn sonra kaybolmasi icin.
            msg.innerText = "";
        }, 5000);
    }
    form.reset();
}