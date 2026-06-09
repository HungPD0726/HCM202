const fs = require('fs');
const path = require('path');

const chapters = [
  {
    id: 1,
    mapId: 'ch1',
    file: 'chapter1.json',
    title: 'Chương I: Khái niệm, đối tượng, phương pháp nghiên cứu và ý nghĩa học tập',
    short: 'Khái niệm và phương pháp',
    color: '#22c55e',
    icon: 'assets/khoahoc.png',
    description: '<b>Chương I</b> giới thiệu những vấn đề nhập môn của học phần Tư tưởng Hồ Chí Minh: khái niệm, đối tượng nghiên cứu, phương pháp nghiên cứu và ý nghĩa học tập. Trọng tâm là hiểu Tư tưởng Hồ Chí Minh như một hệ thống quan điểm toàn diện, sâu sắc về những vấn đề cơ bản của cách mạng Việt Nam.',
    nodes: [
      ['Khái niệm Tư tưởng Hồ Chí Minh', 'Tư tưởng Hồ Chí Minh là hệ thống quan điểm toàn diện và sâu sắc về những vấn đề cơ bản của cách mạng Việt Nam; là kết quả vận dụng, phát triển sáng tạo chủ nghĩa Mác - Lênin vào điều kiện cụ thể của nước ta; kế thừa truyền thống dân tộc và tinh hoa văn hóa nhân loại.'],
      ['Đối tượng nghiên cứu', 'Nghiên cứu hệ thống quan điểm của Hồ Chí Minh và quá trình các quan điểm ấy được vận dụng, hiện thực hóa trong cách mạng Việt Nam. Đối tượng không chỉ là văn bản, bài nói, bài viết mà còn là hoạt động thực tiễn của Người.'],
      ['Phương pháp nghiên cứu', 'Cần dựa trên thế giới quan, phương pháp luận Mác - Lênin; quán triệt nguyên tắc thống nhất lý luận với thực tiễn, quan điểm lịch sử - cụ thể, toàn diện - hệ thống và kế thừa - phát triển.'],
      ['Ý nghĩa học tập', 'Học tập môn học giúp nâng cao năng lực tư duy lý luận, củng cố niềm tin khoa học, bồi dưỡng lòng yêu nước, đạo đức cách mạng và năng lực vận dụng tư tưởng Hồ Chí Minh vào học tập, rèn luyện, cuộc sống.']
    ],
    quiz: [
      ['Theo giáo trình, Tư tưởng Hồ Chí Minh được hiểu là gì?', 'Một hệ thống quan điểm toàn diện và sâu sắc về những vấn đề cơ bản của cách mạng Việt Nam', ['Một tập hợp câu chuyện về cuộc đời Hồ Chí Minh', 'Một học thuyết kinh tế độc lập với chủ nghĩa Mác - Lênin', 'Một phương pháp nghiên cứu lịch sử thế giới'], 'Tư tưởng Hồ Chí Minh là hệ thống quan điểm toàn diện, sâu sắc về những vấn đề cơ bản của cách mạng Việt Nam.'],
      ['Cơ sở quan trọng nhất về thế giới quan và phương pháp luận của Tư tưởng Hồ Chí Minh là gì?', 'Chủ nghĩa Mác - Lênin', ['Nho giáo', 'Chủ nghĩa Tam dân', 'Chủ nghĩa thực dụng'], 'Chủ nghĩa Mác - Lênin cung cấp thế giới quan và phương pháp luận trực tiếp.'],
      ['Đại hội nào của Đảng nêu khái niệm Tư tưởng Hồ Chí Minh tương đối hoàn chỉnh trong giáo trình?', 'Đại hội XI', ['Đại hội V', 'Đại hội VII', 'Đại hội IX'], 'Giáo trình sử dụng khái niệm được Đại hội XI của Đảng nêu rõ.'],
      ['Đối tượng nghiên cứu của môn học Tư tưởng Hồ Chí Minh là gì?', 'Hệ thống quan điểm Hồ Chí Minh và quá trình vận động của hệ thống đó trong thực tiễn', ['Chỉ các tác phẩm văn học của Hồ Chí Minh', 'Lịch sử các triều đại phong kiến Việt Nam', 'Các học thuyết chính trị phương Tây hiện đại'], 'Môn học nghiên cứu cả hệ thống quan điểm và quá trình hiện thực hóa trong cách mạng Việt Nam.'],
      ['Vì sao cần gắn nghiên cứu văn bản với hoạt động thực tiễn của Hồ Chí Minh?', 'Vì tư tưởng của Người thể hiện cả trong bài viết, bài nói và hành động cách mạng', ['Vì văn bản không có giá trị tham khảo', 'Vì chỉ hoạt động thực tiễn mới là đối tượng của môn học', 'Vì môn học không cần phương pháp luận'], 'Tư tưởng Hồ Chí Minh được thể hiện thống nhất trong lý luận và thực tiễn.'],
      ['Nguyên tắc phương pháp luận nào yêu cầu xem xét tư tưởng Hồ Chí Minh trong điều kiện lịch sử cụ thể?', 'Quan điểm lịch sử - cụ thể', ['Quan điểm siêu hình', 'Quan điểm tuyệt đối hóa cá nhân', 'Quan điểm kinh nghiệm chủ nghĩa'], 'Quan điểm lịch sử - cụ thể giúp tránh tách tư tưởng khỏi hoàn cảnh ra đời và vận dụng.'],
      ['Học tập môn Tư tưởng Hồ Chí Minh có ý nghĩa nào đối với sinh viên?', 'Nâng cao tư duy lý luận và rèn luyện đạo đức, lối sống', ['Thay thế toàn bộ các môn chuyên ngành', 'Chỉ để ghi nhớ ngày tháng lịch sử', 'Chỉ phục vụ thi trắc nghiệm'], 'Môn học giúp sinh viên phát triển nhận thức, niềm tin, đạo đức và năng lực vận dụng.'],
      ['Trong khái niệm Tư tưởng Hồ Chí Minh, nội dung “kế thừa và phát triển các giá trị truyền thống tốt đẹp của dân tộc” nhấn mạnh điều gì?', 'Nguồn gốc dân tộc của tư tưởng', ['Tính tách biệt với cách mạng Việt Nam', 'Việc phủ nhận truyền thống', 'Việc chỉ tiếp thu văn hóa phương Tây'], 'Tư tưởng Hồ Chí Minh gắn sâu với truyền thống yêu nước, nhân nghĩa, đoàn kết của dân tộc Việt Nam.'],
      ['Tư tưởng Hồ Chí Minh có giá trị như thế nào đối với Đảng và dân tộc Việt Nam?', 'Là tài sản tinh thần to lớn, soi đường cho cách mạng Việt Nam', ['Chỉ có giá trị trong giai đoạn trước năm 1945', 'Chỉ là tư liệu lịch sử không còn ý nghĩa hiện nay', 'Là học thuyết thay thế hoàn toàn chủ nghĩa Mác - Lênin'], 'Đảng khẳng định Tư tưởng Hồ Chí Minh là tài sản tinh thần to lớn của Đảng và dân tộc.'],
      ['Phương pháp lôgíc trong nghiên cứu Tư tưởng Hồ Chí Minh nhằm mục đích gì?', 'Tìm ra bản chất, mối liên hệ và nội dung có tính quy luật', ['Chỉ liệt kê sự kiện theo năm tháng', 'Loại bỏ bối cảnh lịch sử', 'Thay thế phương pháp lịch sử'], 'Phương pháp lôgíc giúp khái quát bản chất và mối liên hệ bên trong của vấn đề.'],
      ['Phương pháp lịch sử trong nghiên cứu Tư tưởng Hồ Chí Minh chú trọng điều gì?', 'Quá trình phát sinh, phát triển của tư tưởng theo thời gian', ['Chỉ so sánh các định nghĩa', 'Chỉ học thuộc kết luận', 'Chỉ phân tích thuật ngữ'], 'Phương pháp lịch sử xem xét tư tưởng trong tiến trình hình thành và phát triển.'],
      ['Quan hệ giữa phương pháp lôgíc và phương pháp lịch sử nên được hiểu thế nào?', 'Cần kết hợp chặt chẽ trong nghiên cứu', ['Chỉ dùng một trong hai', 'Hai phương pháp loại trừ nhau', 'Không cần trong môn học này'], 'Nghiên cứu Tư tưởng Hồ Chí Minh cần kết hợp lôgíc với lịch sử.'],
      ['Khi học Tư tưởng Hồ Chí Minh, vì sao cần chống “lý luận suông”?', 'Vì lý luận phải gắn với thực hành và giải quyết vấn đề thực tiễn', ['Vì lý luận không cần thiết', 'Vì chỉ cần kinh nghiệm cá nhân', 'Vì môn học không có nội dung ứng dụng'], 'Hồ Chí Minh nhấn mạnh lý luận phải gắn với thực tiễn.'],
      ['Nội dung nào thuộc ý nghĩa học tập môn Tư tưởng Hồ Chí Minh?', 'Giáo dục đạo đức cách mạng và bồi dưỡng lòng yêu nước', ['Học kỹ thuật sản xuất công nghiệp', 'Rèn luyện nghiệp vụ kế toán', 'Thay thế học ngoại ngữ'], 'Môn học góp phần giáo dục đạo đức cách mạng, niềm tin và lòng yêu nước.'],
      ['Bản chất khoa học của Tư tưởng Hồ Chí Minh thể hiện ở điểm nào?', 'Phản ánh những vấn đề có tính quy luật của cách mạng Việt Nam', ['Chỉ dựa vào cảm tính cá nhân', 'Không gắn với thực tiễn', 'Phủ nhận chủ nghĩa Mác - Lênin'], 'Tư tưởng Hồ Chí Minh có cơ sở lý luận, thực tiễn và phản ánh quy luật cách mạng Việt Nam.'],
      ['Bản chất cách mạng của Tư tưởng Hồ Chí Minh thể hiện ở mục tiêu nào?', 'Giải phóng dân tộc, giải phóng xã hội, giải phóng con người', ['Duy trì áp bức thuộc địa', 'Bảo vệ đặc quyền phong kiến', 'Tách dân tộc khỏi thời đại'], 'Tư tưởng Hồ Chí Minh hướng tới giải phóng và phát triển con người.'],
      ['Cụm từ “tư tưởng, đạo đức, phong cách Hồ Chí Minh” thường được học tập nhằm mục đích gì?', 'Vận dụng vào xây dựng Đảng, xã hội và rèn luyện cá nhân', ['Chỉ để trưng bày khẩu hiệu', 'Thay thế mọi quy định pháp luật', 'Loại bỏ giáo dục đạo đức'], 'Việc học tập hướng tới vận dụng trong nhận thức và hành động.'],
      ['Nội dung nào không thuộc phạm vi nhập môn của Chương I?', 'Kỹ thuật tính toán tài chính doanh nghiệp', ['Khái niệm môn học', 'Đối tượng nghiên cứu', 'Phương pháp nghiên cứu'], 'Kỹ thuật tính toán tài chính doanh nghiệp không thuộc nội dung Chương I của HCM202.'],
      ['Khi nói Tư tưởng Hồ Chí Minh là “kim chỉ nam”, ý chính là gì?', 'Có vai trò định hướng hành động cách mạng', ['Là khẩu hiệu không cần vận dụng', 'Chỉ dùng trong nghiên cứu văn học', 'Chỉ áp dụng cho một cá nhân'], 'Kim chỉ nam nghĩa là định hướng cho nhận thức và hành động cách mạng.'],
      ['Yêu cầu quan trọng khi vận dụng Tư tưởng Hồ Chí Minh hiện nay là gì?', 'Sáng tạo, phù hợp thực tiễn, tránh giáo điều', ['Sao chép máy móc mọi hình thức cũ', 'Tách khỏi điều kiện đất nước', 'Chỉ học thuộc định nghĩa'], 'Vận dụng tư tưởng phải gắn thực tiễn và phát triển sáng tạo.']
    ]
  },
  {
    id: 2,
    mapId: 'ch2',
    file: 'chapter2.json',
    title: 'Chương II: Cơ sở, quá trình hình thành và phát triển tư tưởng Hồ Chí Minh',
    short: 'Cơ sở và quá trình hình thành',
    color: '#0ea5e9',
    icon: 'assets/vietnam.png',
    description: '<b>Chương II</b> làm rõ các cơ sở thực tiễn, cơ sở lý luận, nhân tố chủ quan và các giai đoạn hình thành, phát triển tư tưởng Hồ Chí Minh. Đây là chương nền để hiểu vì sao tư tưởng của Người vừa dân tộc, vừa khoa học, vừa cách mạng.',
    nodes: [
      ['Cơ sở thực tiễn', 'Thực tiễn Việt Nam cuối thế kỷ XIX đầu thế kỷ XX đặt ra yêu cầu tìm con đường cứu nước mới. Thực tiễn thế giới, đặc biệt Cách mạng Tháng Mười Nga và phong trào giải phóng dân tộc, tạo điều kiện để Hồ Chí Minh tiếp cận con đường cách mạng vô sản.'],
      ['Cơ sở lý luận', 'Tư tưởng Hồ Chí Minh được hình thành từ chủ nghĩa Mác - Lênin, truyền thống tốt đẹp của dân tộc Việt Nam và tinh hoa văn hóa nhân loại. Trong đó, chủ nghĩa Mác - Lênin là cơ sở thế giới quan và phương pháp luận trực tiếp.'],
      ['Nhân tố chủ quan', 'Phẩm chất, trí tuệ, bản lĩnh, lòng yêu nước thương dân, năng lực tự học, tư duy độc lập và hoạt động thực tiễn phong phú của Hồ Chí Minh là nhân tố quyết định khả năng tiếp thu, chọn lọc và sáng tạo.'],
      ['Quá trình phát triển', 'Tư tưởng Hồ Chí Minh hình thành và phát triển qua nhiều giai đoạn: trước năm 1911, tìm đường cứu nước; 1911-1920, tìm thấy con đường cách mạng vô sản; 1921-1930, hình thành cơ bản tư tưởng về cách mạng Việt Nam; 1930-1969, bổ sung và phát triển toàn diện.']
    ],
    quiz: [
      ['Thực tiễn Việt Nam cuối thế kỷ XIX đầu thế kỷ XX đặt ra yêu cầu gì?', 'Tìm con đường cứu nước mới', ['Duy trì nguyên trạng chế độ thuộc địa', 'Từ bỏ độc lập dân tộc', 'Chỉ cải cách văn hóa'], 'Các phong trào yêu nước cũ thất bại đặt ra yêu cầu tìm đường cứu nước mới.'],
      ['Sự kiện thế giới nào ảnh hưởng sâu sắc đến con đường cách mạng của Hồ Chí Minh?', 'Cách mạng Tháng Mười Nga năm 1917', ['Chiến tranh Nam - Bắc Hoa Kỳ', 'Cách mạng công nghiệp Anh lần thứ nhất', 'Sự thành lập Liên minh châu Âu'], 'Cách mạng Tháng Mười mở ra thời đại mới và con đường giải phóng cho các dân tộc bị áp bức.'],
      ['Nguồn gốc lý luận trực tiếp và chủ yếu của Tư tưởng Hồ Chí Minh là gì?', 'Chủ nghĩa Mác - Lênin', ['Chủ nghĩa dân túy', 'Chủ nghĩa vị lợi', 'Chủ nghĩa biệt lập'], 'Chủ nghĩa Mác - Lênin là nguồn gốc lý luận trực tiếp, chủ yếu.'],
      ['Truyền thống tốt đẹp nào của dân tộc Việt Nam có vai trò nổi bật trong hình thành Tư tưởng Hồ Chí Minh?', 'Chủ nghĩa yêu nước', ['Tâm lý cục bộ địa phương', 'Tư tưởng cam chịu nô lệ', 'Thói quen khép kín văn hóa'], 'Chủ nghĩa yêu nước là giá trị xuyên suốt và động lực ban đầu.'],
      ['Hồ Chí Minh tiếp thu tinh hoa văn hóa nhân loại theo cách nào?', 'Chọn lọc, phê phán, kế thừa những giá trị tiến bộ', ['Sao chép nguyên xi mọi học thuyết', 'Phủ nhận toàn bộ văn hóa phương Đông', 'Chỉ tiếp thu kỹ thuật quân sự'], 'Người tiếp thu có chọn lọc, phát triển các giá trị phù hợp cách mạng Việt Nam.'],
      ['Yếu tố chủ quan nào góp phần quyết định sự hình thành Tư tưởng Hồ Chí Minh?', 'Phẩm chất, trí tuệ, bản lĩnh và hoạt động thực tiễn của Hồ Chí Minh', ['Xuất thân quý tộc', 'May mắn ngẫu nhiên', 'Sự áp đặt của nước ngoài'], 'Nhân cách, trí tuệ và thực tiễn hoạt động phong phú của Người có vai trò quyết định.'],
      ['Giai đoạn trước năm 1911 trong quá trình hình thành Tư tưởng Hồ Chí Minh có đặc điểm gì?', 'Hình thành lòng yêu nước và chí hướng cứu nước', ['Hoàn thiện toàn bộ đường lối cách mạng vô sản', 'Sáng lập Đảng Cộng sản Việt Nam', 'Lãnh đạo kháng chiến chống Mỹ'], 'Trước 1911, Nguyễn Tất Thành hình thành lòng yêu nước và ý chí tìm đường cứu nước.'],
      ['Giai đoạn 1911-1920 có ý nghĩa gì đối với Nguyễn Ái Quốc?', 'Tìm tòi và đến với con đường cách mạng vô sản', ['Rút khỏi hoạt động chính trị', 'Hoàn thành xây dựng nhà nước mới', 'Lãnh đạo Tổng khởi nghĩa Tháng Tám'], 'Đây là giai đoạn Người khảo nghiệm thực tiễn thế giới và đến với chủ nghĩa Mác - Lênin.'],
      ['Năm 1920, Nguyễn Ái Quốc tiếp cận văn kiện nào có ý nghĩa bước ngoặt?', 'Luận cương của Lênin về vấn đề dân tộc và thuộc địa', ['Tuyên ngôn độc lập Hoa Kỳ', 'Bộ luật Hồng Đức', 'Hiệp định Paris'], 'Luận cương của Lênin giúp Người tìm thấy con đường giải phóng dân tộc.'],
      ['Giai đoạn 1921-1930 trong quá trình phát triển tư tưởng Hồ Chí Minh nổi bật ở điểm nào?', 'Hình thành cơ bản tư tưởng về cách mạng Việt Nam', ['Kết thúc hoàn toàn sự nghiệp cách mạng', 'Chỉ hoạt động văn hóa nghệ thuật', 'Không có hoạt động lý luận'], 'Giai đoạn này Người truyền bá chủ nghĩa Mác - Lênin và chuẩn bị thành lập Đảng.'],
      ['Sự ra đời của Đảng Cộng sản Việt Nam năm 1930 gắn với vai trò nào của Hồ Chí Minh?', 'Chuẩn bị chính trị, tư tưởng, tổ chức và chủ trì hợp nhất các tổ chức cộng sản', ['Chỉ là người quan sát bên ngoài', 'Đại diện cho triều đình phong kiến', 'Người phản đối thành lập Đảng'], 'Hồ Chí Minh chuẩn bị và chủ trì Hội nghị thành lập Đảng.'],
      ['Trong các nguồn gốc tư tưởng, chủ nghĩa yêu nước có vai trò gì?', 'Cơ sở ban đầu và động lực thúc đẩy Hồ Chí Minh đến với chủ nghĩa Mác - Lênin', ['Yếu tố không liên quan', 'Nguyên nhân làm Người xa rời dân tộc', 'Chỉ là khẩu hiệu hình thức'], 'Chủ nghĩa yêu nước là động lực ban đầu trên hành trình tìm đường cứu nước.'],
      ['Tinh hoa văn hóa phương Đông được Hồ Chí Minh tiếp thu chủ yếu ở phương diện nào?', 'Các giá trị nhân nghĩa, vị tha, tu dưỡng, hòa hợp với con người', ['Tư tưởng đẳng cấp bảo thủ', 'Quan niệm thần quyền tuyệt đối', 'Chủ nghĩa bành trướng'], 'Người tiếp thu những yếu tố tích cực của Nho giáo, Phật giáo, Lão giáo và các tư tưởng tiến bộ.'],
      ['Tinh hoa văn hóa phương Tây ảnh hưởng đến Hồ Chí Minh qua những giá trị nào?', 'Tự do, bình đẳng, dân chủ, quyền con người và tinh thần cách mạng', ['Chủ nghĩa phân biệt chủng tộc', 'Tư tưởng nô dịch thuộc địa', 'Lối sống hưởng lạc cực đoan'], 'Người tiếp thu các giá trị tiến bộ của văn hóa dân chủ và cách mạng phương Tây.'],
      ['Vì sao phong trào yêu nước cuối thế kỷ XIX đầu thế kỷ XX thất bại?', 'Thiếu đường lối cứu nước đúng đắn và tổ chức lãnh đạo phù hợp thời đại', ['Nhân dân không yêu nước', 'Không có kẻ thù xâm lược', 'Do Việt Nam đã độc lập hoàn toàn'], 'Các phong trào rất anh dũng nhưng hạn chế về đường lối và hệ tư tưởng lãnh đạo.'],
      ['Sự xuất hiện của giai cấp công nhân Việt Nam có ý nghĩa gì?', 'Tạo điều kiện xã hội để chủ nghĩa Mác - Lênin gắn với phong trào yêu nước', ['Làm chấm dứt mọi mâu thuẫn dân tộc', 'Thay thế ngay nhà nước thuộc địa', 'Không liên quan đến cách mạng'], 'Giai cấp công nhân là cơ sở xã hội quan trọng cho sự ra đời của Đảng.'],
      ['Tư tưởng Hồ Chí Minh hình thành như thế nào?', 'Qua quá trình lâu dài, gắn với hoạt động lý luận và thực tiễn phong phú', ['Được hình thành tức thời trong một ngày', 'Do sao chép nguyên xi từ nước ngoài', 'Không cần thực tiễn kiểm nghiệm'], 'Tư tưởng Hồ Chí Minh phát triển qua nhiều giai đoạn và được kiểm nghiệm trong thực tiễn.'],
      ['Nội dung nào thuộc cơ sở thực tiễn thế giới hình thành Tư tưởng Hồ Chí Minh?', 'Chủ nghĩa tư bản chuyển sang giai đoạn đế quốc chủ nghĩa và phong trào giải phóng dân tộc phát triển', ['Việt Nam ban hành Hiến pháp 2013', 'Cuộc cách mạng công nghệ số', 'Sự ra đời ASEAN'], 'Bối cảnh đế quốc chủ nghĩa và phong trào cách mạng thế giới tác động sâu sắc đến Người.'],
      ['Điểm sáng tạo của Hồ Chí Minh khi tiếp thu chủ nghĩa Mác - Lênin là gì?', 'Vận dụng và phát triển phù hợp điều kiện cụ thể Việt Nam', ['Sao chép máy móc mô hình nước khác', 'Tách khỏi vấn đề dân tộc', 'Phủ nhận vai trò nhân dân'], 'Người vận dụng sáng tạo chủ nghĩa Mác - Lênin vào cách mạng thuộc địa và Việt Nam.'],
      ['Nhận định nào đúng về nhân tố chủ quan Hồ Chí Minh?', 'Lòng yêu nước, thương dân và tư duy độc lập giúp Người chọn lọc, sáng tạo tư tưởng', ['Nhân tố cá nhân không có vai trò gì', 'Chỉ hoàn cảnh khách quan tạo nên tư tưởng', 'Người không hoạt động thực tiễn'], 'Nhân tố chủ quan là điều kiện quyết định để chuyển hóa các nguồn gốc thành hệ thống tư tưởng.']
    ]
  }
];

chapters.push(
  {
    id: 3,
    mapId: 'ch3',
    file: 'chapter3.json',
    title: 'Chương III: Tư tưởng Hồ Chí Minh về độc lập dân tộc và chủ nghĩa xã hội',
    short: 'Độc lập dân tộc và CNXH',
    color: '#f97316',
    icon: 'assets/vietnam1.png',
    description: '<b>Chương III</b> trình bày tư tưởng Hồ Chí Minh về độc lập dân tộc, cách mạng giải phóng dân tộc, chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam. Trọng tâm là mối quan hệ độc lập dân tộc gắn liền với chủ nghĩa xã hội.',
    nodes: [
      ['Độc lập dân tộc', 'Độc lập, tự do là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc. Độc lập phải là độc lập thật sự, gắn với quyền làm chủ, hạnh phúc của nhân dân và toàn vẹn chủ quyền quốc gia.'],
      ['Cách mạng giải phóng dân tộc', 'Cách mạng giải phóng dân tộc muốn thắng lợi phải đi theo con đường cách mạng vô sản, do Đảng Cộng sản lãnh đạo, dựa vào lực lượng toàn dân, tiến hành chủ động, sáng tạo và có khả năng giành thắng lợi trước cách mạng chính quốc.'],
      ['Chủ nghĩa xã hội', 'Theo Hồ Chí Minh, chủ nghĩa xã hội là xã hội do nhân dân làm chủ, có kinh tế phát triển, văn hóa - đạo đức tiến bộ, con người được giải phóng, cuộc sống ấm no, tự do, hạnh phúc.'],
      ['Con đường đi lên CNXH ở Việt Nam', 'Việt Nam quá độ lên chủ nghĩa xã hội từ một nước nông nghiệp lạc hậu, bỏ qua chế độ tư bản chủ nghĩa. Quá trình này phải phù hợp điều kiện cụ thể, phát huy động lực con người, kết hợp cải tạo với xây dựng.']
    ],
    quiz: [
      ['Luận điểm trung tâm trong tư tưởng Hồ Chí Minh về vấn đề dân tộc là gì?', 'Độc lập, tự do là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc', ['Dân tộc thuộc địa phải phụ thuộc lâu dài', 'Độc lập không cần gắn với nhân dân', 'Chỉ cần cải cách văn hóa là đủ'], 'Hồ Chí Minh khẳng định không có gì quý hơn độc lập, tự do.'],
      ['Theo Hồ Chí Minh, độc lập dân tộc phải gắn với điều gì để có ý nghĩa đầy đủ?', 'Tự do, hạnh phúc của nhân dân', ['Lợi ích của một thiểu số', 'Sự lệ thuộc vào nước ngoài', 'Chỉ thay đổi tên gọi nhà nước'], 'Độc lập thật sự phải đem lại quyền làm chủ và hạnh phúc cho nhân dân.'],
      ['Con đường cứu nước đúng đắn mà Hồ Chí Minh lựa chọn là gì?', 'Con đường cách mạng vô sản', ['Con đường quân chủ lập hiến', 'Con đường cải lương thuộc địa', 'Con đường dựa hoàn toàn vào ngoại bang'], 'Người khẳng định cách mạng giải phóng dân tộc phải đi theo con đường cách mạng vô sản.'],
      ['Cách mạng giải phóng dân tộc muốn thắng lợi trước hết phải có yếu tố nào?', 'Đảng Cộng sản lãnh đạo', ['Một triều đình phong kiến mạnh', 'Một tầng lớp thống trị mới', 'Sự ban phát của thực dân'], 'Đảng Cộng sản là nhân tố lãnh đạo quyết định thắng lợi.'],
      ['Lực lượng cách mạng giải phóng dân tộc theo Hồ Chí Minh là ai?', 'Toàn dân tộc, trong đó công nông là gốc', ['Chỉ một nhóm trí thức', 'Chỉ giai cấp tư sản', 'Chỉ quân đội nước ngoài'], 'Cách mạng là sự nghiệp của toàn dân, công nông là lực lượng gốc.'],
      ['Hồ Chí Minh cho rằng cách mạng thuộc địa có khả năng như thế nào so với cách mạng ở chính quốc?', 'Có thể chủ động giành thắng lợi trước', ['Luôn phải chờ chính quốc thắng trước', 'Không thể thắng lợi', 'Không liên quan đến phong trào thế giới'], 'Đây là luận điểm sáng tạo về tính chủ động của cách mạng thuộc địa.'],
      ['Mối quan hệ giữa độc lập dân tộc và chủ nghĩa xã hội trong tư tưởng Hồ Chí Minh là gì?', 'Gắn bó chặt chẽ với nhau', ['Hoàn toàn tách rời nhau', 'Độc lập dân tộc phủ nhận chủ nghĩa xã hội', 'Chủ nghĩa xã hội không cần độc lập dân tộc'], 'Độc lập dân tộc gắn liền với chủ nghĩa xã hội là con đường cách mạng Việt Nam.'],
      ['Vì sao độc lập dân tộc là tiền đề đi lên chủ nghĩa xã hội?', 'Có độc lập mới có điều kiện xây dựng xã hội mới do nhân dân làm chủ', ['Độc lập chỉ là vấn đề hình thức', 'Độc lập làm mất vai trò nhân dân', 'Độc lập không liên quan phát triển'], 'Độc lập tạo điều kiện chính trị để xây dựng chủ nghĩa xã hội.'],
      ['Theo Hồ Chí Minh, chủ nghĩa xã hội trước hết nhằm mục tiêu gì?', 'Làm cho nhân dân được ấm no, tự do, hạnh phúc', ['Tăng đặc quyền cho một nhóm người', 'Loại bỏ quyền làm chủ của dân', 'Tách văn hóa khỏi đời sống'], 'Mục tiêu xã hội chủ nghĩa là nâng cao đời sống và quyền làm chủ của nhân dân.'],
      ['Đặc trưng nổi bật của chủ nghĩa xã hội trong tư tưởng Hồ Chí Minh là gì?', 'Nhân dân là chủ và làm chủ', ['Quyền lực thuộc về thực dân', 'Kinh tế trì trệ là mục tiêu', 'Văn hóa bị xem nhẹ'], 'Xã hội xã hội chủ nghĩa là xã hội do nhân dân làm chủ.'],
      ['Động lực quan trọng nhất của chủ nghĩa xã hội theo Hồ Chí Minh là gì?', 'Con người và nhân dân', ['Sự áp đặt hành chính đơn thuần', 'Lợi ích cá nhân ích kỷ', 'Sự phụ thuộc bên ngoài'], 'Hồ Chí Minh coi con người, nhân dân là động lực quyết định.'],
      ['Việt Nam đi lên chủ nghĩa xã hội từ xuất phát điểm nào?', 'Một nước nông nghiệp lạc hậu, bỏ qua chế độ tư bản chủ nghĩa', ['Một nước tư bản phát triển cao', 'Một nước không có vấn đề dân tộc', 'Một xã hội đã công nghiệp hóa hoàn toàn'], 'Đặc điểm lớn nhất là quá độ từ nước nông nghiệp lạc hậu, không kinh qua tư bản chủ nghĩa.'],
      ['Trong xây dựng chủ nghĩa xã hội, Hồ Chí Minh nhấn mạnh cách làm nào?', 'Phù hợp điều kiện Việt Nam, tránh rập khuôn máy móc', ['Sao chép nguyên xi mô hình nước khác', 'Chỉ dựa vào mệnh lệnh', 'Không cần phát huy sáng kiến'], 'Xây dựng chủ nghĩa xã hội phải sáng tạo và phù hợp thực tiễn Việt Nam.'],
      ['Nội dung nào thuộc mục tiêu chính trị của chủ nghĩa xã hội?', 'Xây dựng chế độ do nhân dân lao động làm chủ', ['Khôi phục chế độ thuộc địa', 'Tập trung quyền lực vào cá nhân', 'Xóa bỏ dân chủ'], 'Mục tiêu chính trị là bảo đảm quyền làm chủ của nhân dân.'],
      ['Nội dung nào thuộc mục tiêu kinh tế của chủ nghĩa xã hội?', 'Phát triển kinh tế, nâng cao đời sống nhân dân', ['Duy trì nghèo nàn lạc hậu', 'Chỉ dựa vào viện trợ', 'Không cần sản xuất'], 'Kinh tế phát triển là cơ sở nâng cao đời sống và xây dựng xã hội mới.'],
      ['Hồ Chí Minh nhìn nhận quan hệ giữa lợi ích cá nhân và lợi ích tập thể thế nào?', 'Cần kết hợp hài hòa để tạo động lực', ['Luôn đối lập tuyệt đối', 'Chỉ thừa nhận lợi ích cá nhân', 'Chỉ thừa nhận mệnh lệnh hành chính'], 'Kết hợp lợi ích là một động lực quan trọng trong xây dựng xã hội mới.'],
      ['Biện pháp xây dựng chủ nghĩa xã hội nào phù hợp tư tưởng Hồ Chí Minh?', 'Kết hợp xây dựng với cải tạo, lấy xây dựng làm chính', ['Chỉ phá bỏ mà không xây dựng', 'Đốt cháy mọi giai đoạn bất chấp điều kiện', 'Tách Đảng khỏi nhân dân'], 'Hồ Chí Minh nhấn mạnh xây dựng là nhiệm vụ chủ yếu, lâu dài.'],
      ['Trong tư tưởng Hồ Chí Minh, chủ nghĩa yêu nước chân chính phải gắn với gì?', 'Chủ nghĩa quốc tế trong sáng', ['Chủ nghĩa dân tộc hẹp hòi', 'Tư tưởng kỳ thị dân tộc', 'Sự biệt lập với thế giới'], 'Yêu nước chân chính gắn với đoàn kết quốc tế và tiến bộ nhân loại.'],
      ['Khẩu hiệu “Không có gì quý hơn độc lập, tự do” thể hiện nội dung nào?', 'Giá trị tối cao của độc lập dân tộc và tự do', ['Sự xem nhẹ chủ quyền', 'Quan điểm chỉ chú trọng kinh tế', 'Tư tưởng thỏa hiệp thuộc địa'], 'Khẩu hiệu kết tinh tư tưởng về độc lập, tự do của Hồ Chí Minh.'],
      ['Điểm đúng về cách mạng giải phóng dân tộc theo Hồ Chí Minh là gì?', 'Phải chủ động, sáng tạo, tự lực tự cường và tranh thủ sức mạnh quốc tế', ['Chỉ trông chờ sự giúp đỡ bên ngoài', 'Không cần tổ chức lãnh đạo', 'Không cần lực lượng nhân dân'], 'Người đề cao tự lực, chủ động đồng thời kết hợp sức mạnh thời đại.']
    ]
  },
  {
    id: 4,
    mapId: 'ch4',
    file: 'chapter4.json',
    title: 'Chương IV: Tư tưởng Hồ Chí Minh về Đảng Cộng sản Việt Nam và Nhà nước của nhân dân, do nhân dân, vì nhân dân',
    short: 'Đảng và Nhà nước',
    color: '#a855f7',
    icon: 'assets/map.png',
    description: '<b>Chương IV</b> tập trung vào tư tưởng Hồ Chí Minh về xây dựng Đảng Cộng sản Việt Nam cầm quyền và xây dựng Nhà nước kiểu mới của nhân dân, do nhân dân, vì nhân dân. Đây là nội dung trực tiếp liên quan đến vai trò lãnh đạo, quản lý và phục vụ nhân dân.',
    nodes: [
      ['Đảng Cộng sản Việt Nam', 'Đảng là nhân tố hàng đầu quyết định thắng lợi của cách mạng Việt Nam. Đảng phải lấy chủ nghĩa Mác - Lênin làm nền tảng, gắn bó với nhân dân, có đường lối đúng, tổ chức chặt chẽ và đạo đức cách mạng trong sáng.'],
      ['Đảng cầm quyền', 'Khi trở thành Đảng cầm quyền, Đảng vừa là người lãnh đạo, vừa là người đầy tớ thật trung thành của nhân dân. Đảng phải thường xuyên tự chỉnh đốn, chống quan liêu, tham ô, lãng phí, xa dân.'],
      ['Nhà nước của dân, do dân, vì dân', 'Nhà nước trong tư tưởng Hồ Chí Minh thuộc về nhân dân, do nhân dân lập nên và hoạt động vì lợi ích của nhân dân. Quyền lực nhà nước phải được tổ chức, thực thi và kiểm soát trên nền tảng dân chủ.'],
      ['Cán bộ và pháp quyền', 'Cán bộ, công chức là công bộc của dân, phải cần, kiệm, liêm, chính, chí công vô tư. Nhà nước phải quản lý bằng Hiến pháp, pháp luật, đồng thời kết hợp pháp luật với đạo đức và giáo dục.']
    ],
    quiz: [
      ['Theo Hồ Chí Minh, nhân tố hàng đầu quyết định thắng lợi của cách mạng Việt Nam là gì?', 'Sự lãnh đạo của Đảng Cộng sản Việt Nam', ['Sự tự phát của quần chúng', 'Sự giúp đỡ thay thế hoàn toàn từ bên ngoài', 'Sự tồn tại của chế độ phong kiến'], 'Đảng lãnh đạo đúng đắn là nhân tố quyết định thắng lợi.'],
      ['Hồ Chí Minh nêu sự ra đời của Đảng Cộng sản Việt Nam là kết quả kết hợp những yếu tố nào?', 'Chủ nghĩa Mác - Lênin, phong trào công nhân và phong trào yêu nước', ['Nho giáo, Phật giáo và Lão giáo', 'Phong trào tư sản và địa chủ', 'Chỉ phong trào công nhân tự phát'], 'Hồ Chí Minh bổ sung yếu tố phong trào yêu nước vào quy luật ra đời của Đảng ở Việt Nam.'],
      ['Đảng Cộng sản Việt Nam mang bản chất giai cấp nào?', 'Giai cấp công nhân', ['Giai cấp địa chủ', 'Giai cấp tư sản mại bản', 'Tầng lớp quan lại phong kiến'], 'Đảng mang bản chất giai cấp công nhân, đồng thời đại biểu cho lợi ích dân tộc và nhân dân.'],
      ['Khi là Đảng cầm quyền, Đảng phải đồng thời là gì?', 'Người lãnh đạo và người đầy tớ thật trung thành của nhân dân', ['Tổ chức đứng trên nhân dân', 'Cơ quan thay thế toàn bộ Nhà nước', 'Lực lượng tách khỏi xã hội'], 'Hồ Chí Minh nhấn mạnh Đảng vừa lãnh đạo vừa phục vụ nhân dân.'],
      ['Nội dung xây dựng Đảng theo Hồ Chí Minh bao gồm những mặt nào?', 'Tư tưởng, chính trị, tổ chức và đạo đức', ['Chỉ tài chính', 'Chỉ nghi lễ', 'Chỉ truyền thông'], 'Xây dựng Đảng phải toàn diện trên các mặt cơ bản.'],
      ['Nền tảng tư tưởng của Đảng theo Hồ Chí Minh là gì?', 'Chủ nghĩa Mác - Lênin', ['Chủ nghĩa cá nhân', 'Chủ nghĩa thực dụng', 'Chủ nghĩa cơ hội'], 'Đảng phải lấy chủ nghĩa Mác - Lênin làm nền tảng tư tưởng.'],
      ['Nguyên tắc tổ chức cơ bản của Đảng là gì?', 'Tập trung dân chủ', ['Tự do vô tổ chức', 'Gia trưởng cá nhân', 'Phân tán cục bộ'], 'Tập trung dân chủ là nguyên tắc tổ chức cơ bản của Đảng.'],
      ['Tự phê bình và phê bình trong Đảng nhằm mục đích gì?', 'Làm cho Đảng trong sạch, vững mạnh', ['Chia rẽ nội bộ', 'Hạ thấp vai trò tổ chức', 'Thay thế kỷ luật'], 'Tự phê bình và phê bình là quy luật phát triển của Đảng.'],
      ['Theo Hồ Chí Minh, nguy cơ lớn của Đảng cầm quyền nếu xa dân là gì?', 'Quan liêu, tham ô, lãng phí và suy thoái', ['Tăng cường dân chủ', 'Gắn bó hơn với nhân dân', 'Nâng cao đạo đức'], 'Đảng cầm quyền phải chống quan liêu, tham ô, lãng phí và xa dân.'],
      ['Nhà nước trong tư tưởng Hồ Chí Minh là nhà nước như thế nào?', 'Của nhân dân, do nhân dân, vì nhân dân', ['Của một nhóm đặc quyền', 'Của thực dân', 'Của nhà vua'], 'Nhà nước kiểu mới thuộc về nhân dân và phục vụ nhân dân.'],
      ['“Nhà nước của dân” nghĩa là gì?', 'Mọi quyền lực nhà nước thuộc về nhân dân', ['Nhân dân không có quyền tham gia', 'Quyền lực chỉ thuộc về cá nhân', 'Nhà nước không chịu trách nhiệm trước dân'], 'Của dân là quyền lực thuộc về nhân dân.'],
      ['“Nhà nước do dân” nhấn mạnh điều gì?', 'Nhân dân lập nên, ủng hộ, kiểm soát và tham gia xây dựng nhà nước', ['Nhà nước tự tồn tại ngoài nhân dân', 'Nhà nước do nước ngoài lập', 'Nhân dân chỉ phục tùng'], 'Do dân là nhà nước được nhân dân xây dựng và kiểm soát.'],
      ['“Nhà nước vì dân” có nội dung gì?', 'Hoạt động vì lợi ích và hạnh phúc của nhân dân', ['Hoạt động vì đặc quyền cá nhân', 'Chỉ lo hình thức', 'Không cần phục vụ xã hội'], 'Vì dân là mục tiêu phục vụ nhân dân.'],
      ['Cán bộ, công chức theo Hồ Chí Minh là gì của nhân dân?', 'Công bộc của dân', ['Ông chủ đứng trên dân', 'Người cai trị theo đặc quyền', 'Lực lượng tách khỏi dân'], 'Cán bộ là công bộc, phải phục vụ nhân dân.'],
      ['Phẩm chất đạo đức quan trọng của cán bộ là gì?', 'Cần, kiệm, liêm, chính, chí công vô tư', ['Quan liêu, xa dân', 'Tư lợi cá nhân', 'Lãng phí và hình thức'], 'Hồ Chí Minh đặt yêu cầu cao về đạo đức công vụ.'],
      ['Nhà nước pháp quyền theo tư tưởng Hồ Chí Minh phải quản lý xã hội bằng gì?', 'Hiến pháp và pháp luật', ['Tình cảm cá nhân tùy tiện', 'Mệnh lệnh bí mật không kiểm soát', 'Phong tục thay cho luật pháp'], 'Nhà nước phải đề cao Hiến pháp, pháp luật và kỷ cương.'],
      ['Quan hệ giữa pháp luật và đạo đức trong quản lý nhà nước theo Hồ Chí Minh là gì?', 'Kết hợp chặt chẽ', ['Loại trừ nhau', 'Chỉ cần pháp luật, không cần đạo đức', 'Chỉ cần đạo đức, không cần pháp luật'], 'Hồ Chí Minh coi trọng cả pháp luật và giáo dục đạo đức.'],
      ['Dân chủ trong nhà nước kiểu mới thể hiện trước hết ở đâu?', 'Nhân dân có quyền làm chủ và tham gia quản lý xã hội', ['Nhân dân không được bày tỏ ý kiến', 'Quyền lực không cần kiểm soát', 'Chỉ có hình thức bầu cử'], 'Dân chủ là bản chất của nhà nước của dân, do dân, vì dân.'],
      ['Để xây dựng Đảng trong sạch, vững mạnh cần làm gì thường xuyên?', 'Xây dựng, chỉnh đốn Đảng', ['Che giấu khuyết điểm', 'Tách Đảng khỏi nhân dân', 'Xem nhẹ kỷ luật'], 'Xây dựng, chỉnh đốn Đảng là yêu cầu thường xuyên.'],
      ['Mối quan hệ đúng giữa Đảng, Nhà nước và nhân dân là gì?', 'Đảng lãnh đạo, Nhà nước quản lý, nhân dân làm chủ', ['Đảng thay thế nhân dân làm chủ', 'Nhà nước đứng ngoài sự lãnh đạo', 'Nhân dân không có vai trò'], 'Đây là quan hệ chính trị cơ bản cần bảo đảm trong hệ thống chính trị.']
    ]
  }
);

chapters.push(
  {
    id: 5,
    mapId: 'ch5',
    file: 'chapter5.json',
    title: 'Chương V: Tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế',
    short: 'Đại đoàn kết',
    color: '#eab308',
    icon: 'assets/vietnam.png',
    description: '<b>Chương V</b> làm rõ đại đoàn kết toàn dân tộc là chiến lược cơ bản, lâu dài, quyết định thành công của cách mạng; đồng thời phân tích đoàn kết quốc tế và sự kết hợp sức mạnh dân tộc với sức mạnh thời đại.',
    nodes: [
      ['Vai trò đại đoàn kết', 'Đại đoàn kết toàn dân tộc là vấn đề có ý nghĩa chiến lược, quyết định thành công của cách mạng. Đoàn kết tạo nên sức mạnh tổng hợp để vượt qua khó khăn và giành thắng lợi.'],
      ['Lực lượng và hình thức tổ chức', 'Chủ thể đại đoàn kết là toàn thể nhân dân Việt Nam yêu nước. Hình thức tổ chức tiêu biểu là Mặt trận dân tộc thống nhất, đặt dưới sự lãnh đạo của Đảng và hoạt động trên nền tảng lợi ích dân tộc.'],
      ['Nguyên tắc đoàn kết', 'Đoàn kết phải dựa trên mục tiêu chung, lấy lợi ích tối cao của dân tộc và quyền lợi cơ bản của nhân dân làm điểm tương đồng; vừa đoàn kết rộng rãi, vừa đấu tranh với những biểu hiện chia rẽ, hẹp hòi.'],
      ['Đoàn kết quốc tế', 'Đoàn kết quốc tế là kết hợp sức mạnh dân tộc với sức mạnh thời đại; tranh thủ sự đồng tình, ủng hộ của các lực lượng tiến bộ, đồng thời tôn trọng độc lập, tự chủ, hữu nghị và hợp tác.']
    ],
    quiz: [
      ['Theo Hồ Chí Minh, đại đoàn kết toàn dân tộc có vai trò gì?', 'Là vấn đề chiến lược quyết định thành công của cách mạng', ['Chỉ là sách lược tạm thời', 'Không liên quan đến thắng lợi cách mạng', 'Chỉ dùng trong ngoại giao'], 'Đại đoàn kết là chiến lược lâu dài, quyết định thắng lợi.'],
      ['Chủ thể của khối đại đoàn kết toàn dân tộc là ai?', 'Toàn thể nhân dân Việt Nam yêu nước', ['Chỉ một giai cấp duy nhất', 'Chỉ người ở đô thị', 'Chỉ người có chức vụ'], 'Chủ thể đại đoàn kết là toàn dân, mọi người Việt Nam yêu nước.'],
      ['Nền tảng của khối đại đoàn kết toàn dân tộc là gì?', 'Liên minh công nhân, nông dân và trí thức dưới sự lãnh đạo của Đảng', ['Liên minh địa chủ và thực dân', 'Sự chia rẽ vùng miền', 'Sự đối lập tôn giáo'], 'Liên minh công - nông - trí là nền tảng quan trọng của đại đoàn kết.'],
      ['Hình thức tổ chức tiêu biểu của khối đại đoàn kết là gì?', 'Mặt trận dân tộc thống nhất', ['Một công ty thương mại', 'Một hội kín biệt lập', 'Một thiết chế phong kiến'], 'Mặt trận dân tộc thống nhất là hình thức tổ chức của đại đoàn kết.'],
      ['Điểm tương đồng để quy tụ lực lượng đoàn kết theo Hồ Chí Minh là gì?', 'Lợi ích tối cao của dân tộc và quyền lợi cơ bản của nhân dân', ['Lợi ích cục bộ hẹp hòi', 'Đặc quyền của một nhóm', 'Sự khác biệt để chia rẽ'], 'Đoàn kết phải đặt lợi ích dân tộc và nhân dân lên trên hết.'],
      ['Nguyên tắc quan trọng trong xây dựng Mặt trận là gì?', 'Đặt dưới sự lãnh đạo của Đảng và hoạt động trên cơ sở hiệp thương dân chủ', ['Hoạt động không mục tiêu', 'Loại bỏ mọi tầng lớp ngoài công nhân', 'Tách khỏi nhân dân'], 'Mặt trận cần sự lãnh đạo của Đảng và phương thức dân chủ, đồng thuận.'],
      ['Đoàn kết trong tư tưởng Hồ Chí Minh phải đi đôi với điều gì?', 'Đấu tranh chống chia rẽ, hẹp hòi, bè phái', ['Dung túng mọi biểu hiện sai trái', 'Xóa bỏ nguyên tắc', 'Phủ nhận lợi ích dân tộc'], 'Đoàn kết rộng rãi nhưng có nguyên tắc, chống chia rẽ.'],
      ['Hồ Chí Minh xem đoàn kết là gì?', 'Sức mạnh, then chốt của thành công', ['Yếu tố phụ không quan trọng', 'Công việc chỉ của ngoại giao', 'Vấn đề sau khi cách mạng thắng lợi mới cần'], 'Người nhiều lần khẳng định đoàn kết là sức mạnh và then chốt thành công.'],
      ['Đại đoàn kết toàn dân tộc phải gắn với yếu tố nào?', 'Đoàn kết quốc tế', ['Biệt lập dân tộc', 'Tư tưởng kỳ thị', 'Cạnh tranh chia rẽ nội bộ'], 'Sức mạnh dân tộc cần kết hợp với sức mạnh thời đại.'],
      ['Đoàn kết quốc tế trong tư tưởng Hồ Chí Minh bao gồm đoàn kết với lực lượng nào?', 'Phong trào cộng sản, công nhân quốc tế, phong trào giải phóng dân tộc và lực lượng tiến bộ', ['Chỉ các thế lực áp bức thuộc địa', 'Chỉ một nhóm lợi ích kinh tế', 'Không cần bất kỳ lực lượng nào'], 'Đoàn kết quốc tế hướng tới các lực lượng cách mạng và tiến bộ trên thế giới.'],
      ['Nguyên tắc đoàn kết quốc tế của Hồ Chí Minh là gì?', 'Độc lập, tự chủ, bình đẳng, hữu nghị và hợp tác', ['Phụ thuộc tuyệt đối vào bên ngoài', 'Can thiệp vào nội bộ nước khác', 'Chỉ nhận giúp đỡ, không có trách nhiệm'], 'Đoàn kết quốc tế phải dựa trên độc lập tự chủ và tinh thần trong sáng.'],
      ['Sức mạnh dân tộc trong tư tưởng Hồ Chí Minh bao gồm yếu tố nào?', 'Chủ nghĩa yêu nước, ý chí độc lập, đoàn kết và sức sáng tạo của nhân dân', ['Sự chia rẽ dân tộc', 'Tâm lý tự ti', 'Sự lệ thuộc thuộc địa'], 'Sức mạnh dân tộc bắt nguồn từ truyền thống và lực lượng nhân dân.'],
      ['Sức mạnh thời đại trong tư tưởng Hồ Chí Minh là gì?', 'Sức mạnh của xu thế cách mạng, hòa bình, độc lập dân tộc, dân chủ và tiến bộ xã hội', ['Sự thống trị của chủ nghĩa thực dân', 'Sự cô lập quốc tế', 'Sự lạc hậu kỹ thuật'], 'Sức mạnh thời đại là các xu thế tiến bộ của thế giới mà cách mạng Việt Nam cần tranh thủ.'],
      ['Kết hợp sức mạnh dân tộc với sức mạnh thời đại nhằm mục đích gì?', 'Tạo sức mạnh tổng hợp cho cách mạng Việt Nam', ['Làm suy yếu nội lực dân tộc', 'Thay thế nhân dân bằng ngoại lực', 'Tách Việt Nam khỏi phong trào thế giới'], 'Sự kết hợp tạo nên sức mạnh tổng hợp.'],
      ['Trong đoàn kết, Hồ Chí Minh chủ trương xử lý khác biệt như thế nào?', 'Tìm điểm tương đồng, tôn trọng khác biệt không trái lợi ích chung', ['Khoét sâu mọi khác biệt', 'Loại bỏ mọi người có ý kiến khác', 'Không cần mục tiêu chung'], 'Người nhấn mạnh nhân điểm tương đồng, hạn chế khác biệt để đoàn kết.'],
      ['Đại đoàn kết có phạm vi như thế nào?', 'Rộng rãi, lâu dài, bao gồm mọi người Việt Nam yêu nước trong và ngoài nước', ['Chỉ trong một thời điểm ngắn', 'Chỉ trong một địa phương', 'Chỉ trong một tầng lớp'], 'Đại đoàn kết là chiến lược rộng rãi, lâu dài của cách mạng.'],
      ['Vai trò của Đảng trong đại đoàn kết là gì?', 'Lãnh đạo, định hướng và tổ chức khối đoàn kết', ['Đứng ngoài khối đoàn kết', 'Chia rẽ các lực lượng', 'Thay thế Mặt trận bằng mệnh lệnh'], 'Đảng lãnh đạo để khối đoàn kết có mục tiêu và tổ chức đúng đắn.'],
      ['Nội dung nào không phù hợp với tư tưởng đại đoàn kết của Hồ Chí Minh?', 'Phân biệt, chia rẽ dân tộc, tôn giáo, giai cấp', ['Khoan dung và nhân ái', 'Tôn trọng lợi ích chung', 'Tập hợp mọi người yêu nước'], 'Chia rẽ và kỳ thị trái với tinh thần đại đoàn kết.'],
      ['Đoàn kết quốc tế phải gắn với nhiệm vụ nào của cách mạng Việt Nam?', 'Bảo vệ độc lập dân tộc và đóng góp vào hòa bình, tiến bộ của nhân loại', ['Từ bỏ độc lập tự chủ', 'Đặt lợi ích nước ngoài lên trên dân tộc', 'Không quan tâm hòa bình thế giới'], 'Hồ Chí Minh kết hợp lợi ích dân tộc với nghĩa vụ quốc tế trong sáng.'],
      ['Bài học vận dụng hiện nay từ tư tưởng đại đoàn kết là gì?', 'Phát huy đồng thuận xã hội, tôn trọng khác biệt, củng cố niềm tin của nhân dân', ['Nuôi dưỡng chia rẽ', 'Xem nhẹ Mặt trận và đoàn thể', 'Tách người Việt Nam ở nước ngoài khỏi dân tộc'], 'Vận dụng tư tưởng đại đoàn kết giúp củng cố khối đại đoàn kết toàn dân trong điều kiện mới.']
    ]
  },
  {
    id: 6,
    mapId: 'ch6',
    file: 'chapter6.json',
    title: 'Chương VI: Tư tưởng Hồ Chí Minh về văn hóa, đạo đức, con người',
    short: 'Văn hóa, đạo đức, con người',
    color: '#ef4444',
    icon: 'assets/macimg.png',
    description: '<b>Chương VI</b> trình bày tư tưởng Hồ Chí Minh về văn hóa, đạo đức và con người. Nội dung trọng tâm là xây dựng nền văn hóa mới, đạo đức cách mạng và con người Việt Nam phát triển toàn diện.',
    nodes: [
      ['Tư tưởng về văn hóa', 'Văn hóa có quan hệ chặt chẽ với chính trị, kinh tế, xã hội; vừa là mục tiêu, vừa là động lực của cách mạng. Hồ Chí Minh chủ trương xây dựng nền văn hóa dân tộc, khoa học, đại chúng.'],
      ['Tư tưởng về đạo đức', 'Đạo đức là gốc của người cách mạng. Những chuẩn mực cơ bản gồm trung với nước, hiếu với dân; cần, kiệm, liêm, chính, chí công vô tư; thương yêu con người; tinh thần quốc tế trong sáng.'],
      ['Nguyên tắc rèn luyện đạo đức', 'Rèn luyện đạo đức phải nói đi đôi với làm, nêu gương; xây đi đôi với chống; tu dưỡng suốt đời trong học tập, lao động, quan hệ với nhân dân và trong tự phê bình, phê bình.'],
      ['Tư tưởng về con người', 'Con người vừa là mục tiêu, vừa là động lực của cách mạng. Xây dựng con người mới là nhiệm vụ lâu dài, gắn với giáo dục, bồi dưỡng thế hệ trẻ, phát huy nhân dân và chiến lược trồng người.']
    ],
    quiz: [
      ['Theo Hồ Chí Minh, văn hóa có quan hệ như thế nào với chính trị, kinh tế, xã hội?', 'Có quan hệ chặt chẽ, tác động qua lại', ['Hoàn toàn tách biệt', 'Chỉ phụ thuộc vào nghệ thuật', 'Không liên quan đến đời sống'], 'Hồ Chí Minh xem chính trị, kinh tế, văn hóa, xã hội có quan hệ tác động lẫn nhau.'],
      ['Nền văn hóa mới Việt Nam theo Hồ Chí Minh có tính chất nào?', 'Dân tộc, khoa học, đại chúng', ['Thuộc địa, phong kiến, biệt lập', 'Xa rời nhân dân', 'Chỉ phục vụ thiểu số'], 'Hồ Chí Minh chủ trương xây dựng nền văn hóa dân tộc, khoa học, đại chúng.'],
      ['Văn hóa trong tư tưởng Hồ Chí Minh có vai trò gì?', 'Vừa là mục tiêu, vừa là động lực của cách mạng', ['Chỉ là hoạt động giải trí', 'Không cần trong xây dựng đất nước', 'Chỉ dành cho giới trí thức'], 'Văn hóa góp phần định hướng, giáo dục và thúc đẩy phát triển xã hội.'],
      ['Hồ Chí Minh coi đạo đức có vị trí như thế nào đối với người cách mạng?', 'Là gốc của người cách mạng', ['Là yếu tố phụ không cần rèn luyện', 'Chỉ cần khi về già', 'Chỉ dùng trong đời tư'], 'Người khẳng định đạo đức là gốc của người cách mạng.'],
      ['Chuẩn mực “trung với nước, hiếu với dân” nghĩa là gì?', 'Trung thành với Tổ quốc, tận tụy phục vụ nhân dân', ['Trung với cá nhân, xa dân', 'Chỉ trung với dòng họ', 'Chỉ phục vụ lợi ích riêng'], 'Đây là chuẩn mực bao trùm trong đạo đức cách mạng.'],
      ['“Cần, kiệm, liêm, chính, chí công vô tư” thuộc nội dung nào?', 'Chuẩn mực đạo đức cách mạng', ['Kỹ thuật sản xuất', 'Quy tắc ngoại giao thuần túy', 'Phương pháp thống kê'], 'Đó là các phẩm chất đạo đức cơ bản Hồ Chí Minh yêu cầu cán bộ, đảng viên rèn luyện.'],
      ['Nguyên tắc rèn luyện đạo đức “nói đi đôi với làm” yêu cầu điều gì?', 'Thống nhất lời nói với hành động, nêu gương bằng việc làm', ['Nói nhiều hơn làm', 'Chỉ tuyên truyền khẩu hiệu', 'Làm trái điều đã nói'], 'Hồ Chí Minh đặc biệt coi trọng nêu gương và thực hành đạo đức.'],
      ['Nguyên tắc “xây đi đôi với chống” trong rèn luyện đạo đức nghĩa là gì?', 'Xây dựng phẩm chất tốt đồng thời chống biểu hiện sai trái', ['Chỉ phê phán mà không xây dựng', 'Chỉ khen ngợi mà không sửa sai', 'Không cần tự rèn luyện'], 'Rèn luyện đạo đức phải vừa bồi dưỡng cái tốt, vừa chống cái xấu.'],
      ['Vì sao Hồ Chí Minh yêu cầu tu dưỡng đạo đức suốt đời?', 'Vì đạo đức cách mạng phải được rèn luyện bền bỉ trong mọi hoàn cảnh', ['Vì đạo đức tự nhiên có sẵn và không đổi', 'Vì chỉ cần rèn luyện khi thi', 'Vì chỉ cán bộ cấp cao mới cần đạo đức'], 'Tu dưỡng đạo đức là công việc thường xuyên, lâu dài.'],
      ['Tình yêu thương con người trong đạo đức Hồ Chí Minh hướng tới ai?', 'Những người lao động, người bị áp bức và toàn thể nhân dân', ['Chỉ người thân trong gia đình', 'Chỉ người cùng địa vị', 'Chỉ người có quyền lực'], 'Tình yêu thương con người của Hồ Chí Minh rộng lớn, gắn với giải phóng con người.'],
      ['Tinh thần quốc tế trong sáng trong đạo đức Hồ Chí Minh là gì?', 'Đoàn kết với các dân tộc và lực lượng tiến bộ vì hòa bình, độc lập, dân chủ', ['Phục tùng nước ngoài', 'Kỳ thị dân tộc khác', 'Chỉ quan tâm lợi ích cá nhân'], 'Tinh thần quốc tế trong sáng gắn với đoàn kết và tiến bộ nhân loại.'],
      ['Theo Hồ Chí Minh, con người có vị trí gì trong cách mạng?', 'Vừa là mục tiêu, vừa là động lực', ['Chỉ là phương tiện', 'Không có vai trò quyết định', 'Chỉ là đối tượng quản lý'], 'Con người là trung tâm trong tư tưởng Hồ Chí Minh.'],
      ['Quan điểm “trồng người” của Hồ Chí Minh nhấn mạnh nhiệm vụ nào?', 'Giáo dục, bồi dưỡng con người, nhất là thế hệ trẻ', ['Chỉ phát triển nông nghiệp', 'Chỉ đào tạo quân sự', 'Không cần giáo dục đạo đức'], 'Trồng người là chiến lược giáo dục, bồi dưỡng con người lâu dài.'],
      ['Xây dựng con người mới theo Hồ Chí Minh cần kết hợp những mặt nào?', 'Đức và tài', ['Chỉ tài năng chuyên môn', 'Chỉ hình thức bên ngoài', 'Chỉ thành tích cá nhân'], 'Người coi trọng cả đạo đức và năng lực.'],
      ['Văn hóa đời sống theo Hồ Chí Minh gắn với nội dung nào?', 'Xây dựng lối sống mới, nếp sống mới, đời sống mới', ['Xa rời sinh hoạt nhân dân', 'Chỉ sao chép phong tục cũ', 'Chỉ chú trọng nghi lễ'], 'Hồ Chí Minh quan tâm xây dựng đời sống mới trong sinh hoạt hằng ngày.'],
      ['Trong tư tưởng Hồ Chí Minh, văn hóa phải phục vụ ai?', 'Nhân dân', ['Một thiểu số đặc quyền', 'Chính quyền thuộc địa', 'Cá nhân nghệ sĩ'], 'Văn hóa phải gắn với nhân dân và phục vụ nhân dân.'],
      ['Tư tưởng Hồ Chí Minh về văn hóa văn nghệ nhấn mạnh điều gì?', 'Văn nghệ là một mặt trận, nghệ sĩ là chiến sĩ trên mặt trận ấy', ['Văn nghệ không liên quan xã hội', 'Văn nghệ chỉ để tiêu khiển', 'Văn nghệ không cần tính dân tộc'], 'Hồ Chí Minh xem văn hóa văn nghệ có vai trò chiến đấu, giáo dục và xây dựng con người.'],
      ['Biểu hiện trái với đạo đức cách mạng theo Hồ Chí Minh là gì?', 'Chủ nghĩa cá nhân, quan liêu, tham ô, lãng phí', ['Cần kiệm liêm chính', 'Nói đi đôi với làm', 'Tận tụy phục vụ nhân dân'], 'Chủ nghĩa cá nhân là nguồn gốc của nhiều căn bệnh đạo đức.'],
      ['Học tập đạo đức Hồ Chí Minh hiện nay cần chú trọng điều gì?', 'Rèn luyện bằng hành động cụ thể trong học tập, lao động và quan hệ xã hội', ['Chỉ học thuộc khẩu hiệu', 'Chỉ yêu cầu người khác thay đổi', 'Không cần tự phê bình'], 'Học tập đạo đức phải gắn với thực hành thường xuyên.'],
      ['Nội dung nào thuộc Chương VI của giáo trình HCM202?', 'Văn hóa, đạo đức, con người', ['Kỹ năng lập ngân sách cá nhân', 'Phương pháp kế toán doanh nghiệp', 'Kỹ thuật phân tích thị trường'], 'Chương VI tập trung vào văn hóa, đạo đức và con người trong tư tưởng Hồ Chí Minh.']
    ]
  }
);

function makeQuestion(chapter, index, raw) {
  const answerIndex = index % 4;
  const options = raw[2].slice();
  options.splice(answerIndex, 0, raw[1]);
  return {
    id: chapter * 100 + index + 1,
    chapter,
    question: raw[0],
    options,
    answer: answerIndex,
    explain: raw[3]
  };
}

function makeNode(chapter, node, index) {
  const nodeId = `${chapter.mapId}_${index + 1}`;
  return {
    id: nodeId,
    name: node[0],
    level: 2,
    color: chapter.color,
    description: node[1],
    meaning: '',
    children: [
      {
        id: `${nodeId}_a`,
        name: 'Ý chính cần nhớ',
        level: 3,
        color: '#ca8a04',
        description: node[1],
        meaning: ''
      },
      {
        id: `${nodeId}_b`,
        name: 'Gợi ý ôn tập',
        level: 3,
        color: '#ca8a04',
        description: 'Khi ôn phần này, hãy trả lời được: khái niệm trung tâm là gì, vì sao nội dung này quan trọng trong tư tưởng Hồ Chí Minh, và có thể vận dụng như thế nào trong nhận thức, học tập hoặc thực tiễn hiện nay.',
        meaning: ''
      }
    ]
  };
}

const allQuestions = [];

for (const chapter of chapters) {
  const questions = chapter.quiz.map((q, i) => makeQuestion(chapter.id, i, q));
  const chapterPath = path.join(__dirname, '..', 'data', chapter.file);
  fs.writeFileSync(chapterPath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  allQuestions.push(...questions);
}

const mindmap = {
  id: 'root',
  name: 'ĐƯỜNG KÁCH MỆNH\nHCM202',
  level: 0,
  icon: 'assets/vietnam1.png',
  description: '<b>Đường Kách Mệnh</b> - Hệ thống học tập <b>HCM202 (Tư tưởng Hồ Chí Minh)</b>, hệ thống hóa những quan điểm cơ bản của Hồ Chí Minh về cách mạng Việt Nam. Nội dung project được sắp xếp theo 6 chương của giáo trình 2019, kết hợp trọng tâm ôn tập trong đề cương lý thuyết.',
  vietnam_example: '',
  meaning: 'Mục tiêu học tập: nắm khái niệm, cơ sở hình thành, nội dung cốt lõi và giá trị vận dụng của Tư tưởng Hồ Chí Minh trong học tập, rèn luyện và thực tiễn xây dựng đất nước.',
  children: chapters.map((chapter) => ({
    id: chapter.mapId,
    name: chapter.title.toUpperCase(),
    shortName: chapter.short,
    level: 1,
    color: chapter.color,
    icon: chapter.icon,
    description: chapter.description,
    vietnam_example: '',
    meaning: '',
    children: chapter.nodes.map((node, index) => makeNode(chapter, node, index))
  }))
};

fs.writeFileSync(path.join(__dirname, '..', 'data', 'quiz.json'), JSON.stringify(allQuestions, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(__dirname, '..', 'data', 'mindmap.json'), JSON.stringify(mindmap, null, 2) + '\n', 'utf8');

console.log(`Generated ${chapters.length} chapters and ${allQuestions.length} questions.`);
