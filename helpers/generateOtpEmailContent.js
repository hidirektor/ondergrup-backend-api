const generateOtpEmailContent = (otpCode) => {
    return `
        <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
            <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                <div style="border-bottom: 1px solid #eee">
                    <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">
                        <img src="cid:ondergrupMain" alt="Önder Grup" style="display: block; margin: 0 auto; width: 230px; height: 150px" />
                    </a>
                </div>
                <p style="font-size: 1.1em">Merhabalar,</p>
                <p>Önder Grup Tasarım Merkezi'ni seçtiğiniz için teşekkür ederiz. Aşağıdaki tek seferlik kodu kullanarak şifrenizi sıfırlayabilirsiniz. Unutmayın bu kod yalnızca <strong style="font-size: 18px">1 dakika</strong> boyunca geçerlidir!</p>
                <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">
                    ${otpCode}
                </h2>
                <p style="font-size: 0.9em;">Saygılarımızla,<br/>Önder Grup Tasarım Merkezi</p>
                <hr style="border: none; border-top: 1px solid #eee" />
                <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
                    <p><a href="https://ondergrup.com">Önder Lift Çelik Mak. San. Tic. Ltd. Şti.</a></p>
                    <p><a href="https://www.google.com/maps/place/%C3%96nder+Lift+%C3%87elik+Mak.+San.+Tic.+Ltd.+%C5%9Eti./@38.4851028,27.6519011,15z/data=!4m2!3m1!1s0x0:0x8f19e57eecad8dea?sa=X&ved=2ahUKEwi3gNv82PCAAxVBRvEDHVP_A-8Q_BJ6BAhKEAA&ved=2ahUKEwi3gNv82PCAAxVBRvEDHVP_A-8Q_BJ6BAhNEAg">1. O.S.B., Organize Sanayi Bölgesi, 2004. Sokak No:4, 45410</a></p>
                    <p><a href="https://www.google.com/maps/place/%C3%96nder+Lift+%C3%87elik+Mak.+San.+Tic.+Ltd.+%C5%9Eti./@38.4851028,27.6519011,15z/data=!4m2!3m1!1s0x0:0x8f19e57eecad8dea?sa=X&ved=2ahUKEwi3gNv82PCAAxVBRvEDHVP_A-8Q_BJ6BAhKEAA&ved=2ahUKEwi3gNv82PCAAxVBRvEDHVP_A-8Q_BJ6BAhNEAg">Turgutlu Manisa / Turkey</a></p>
                </div>
            </div>
        </div>
    `;
};

module.exports = generateOtpEmailContent;