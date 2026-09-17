# Epohers World Cup 3 — старт графики

## Актуальная версия: v2

После замечаний пользователя созданы отдельные output/*_v2.psd и *_v2.png. Предыдущие версии сохранены.

- Logo_Autumn2_v2: кастомная кремовая тройка по пользовательскому рисунку; редактируемый контур сохранён в Paths, залитый знак на отдельном слое. Внутренний слой листьев расположен над исходным щитом, а дубликат исходного персонажа и ленты защищён маской поверх него. Прозрачный PNG находится в assets, непрозрачный нейтральный preview — в output.
- Баннер v2: imagegen создал единую панораму по autumn_bg_02 — общий горизонт, согласованные стороны и живописный переход по центру без стыка. Файл assets/autumn_panorama_v2.png. Текст тёмный #292921 с тонкой кремовой обводкой, шрифты исходные.
- Анонс v2: все старые подложки скрыты; новые сгенерированные размашистые мазки assets/brush_swash_v2.png собраны смарт-объектами в группе New painted brush backings. Кремовые и охристые буквы отделены от фона. Новый логотип заменён в обоих форматах.
- Последняя визуальная проверка — по итоговым PNG; все три PSD v2 сохранены и открыты в Photoshop. Активен логотип v2.

Подготовлено 11 сентября 2026. Ближайшая задача: открытие заявок. Даты турнира: 10–25 октября, призовой фонд $2,500. Язык баннеров оставлен английским по исходным макетам.

## Готовые материалы

- output/EWC3_Registration_Banner.psd и .png — 2556×639.
- output/EWC3_Registration_Announcement.psd и .png — 1920×1080.
- output/Logo_Autumn2.psd — логотип со смарт-объектами универсального щита и нового венка, редактируемой цифрой 3.
- assets/Logo_Autumn2.png — прозрачный логотип 1240×1510.
- assets/autumn_wreath.png — отдельный прозрачный венок, imagegen.
- assets/autumn_bg_01.png … autumn_bg_04.png — четыре новых фона Krea, 1376×768.

PSD сохраняют скрытые исходные слои, исходную типографику и фактуры. Новые фоны и логотип добавлены смарт-объектами. Оригинальные PSD не перезаписаны. Скрипты в scripts — рабочие этапы сборки, а не единый идемпотентный генератор; окончательная ручная программная доводка сохранена в PSD.

## Визуальное направление

Живописные осенние пейзажи с крупными мазками, золотистые поля, медные и охристые листья, прохладное серо-голубое небо. В логотипе сохранены исходные персонаж, щит и надписи. Венок — чёрные неровные контуры, прожилки, дубовые и кленовые листья, охра, оранжевый, красно-коричневый и приглушённый оливковый. Основные шрифты макетов: SouthPark_Cyr, southpark, ChineseRocksRg-Regular.

## Krea

Проект: https://www.krea.ai/image?project=019bb880-d317-7330-a56e-997f84311fe1

Параметры восстановлены через Reuse parameters у прежней генерации: Flux, 16:9, один LoRA (в интерфейсе 1/5), Style reference 74%. Название LoRA не раскрывалось. Один новый batch из четырёх изображений успешно создан и скачан. Показанная оценка: 14 compute units.

Промпт:

> autumn landscape, epic, cloudy. 80% sky, golden ochre fields, distant amber and copper woodland, delicate oak branches with a few russet leaves framing the edges, crisp October air.

В баннере использованы варианты 01 и 02; в анонсе 02. Вариант 03 содержит сгенерированный знак, похожий на подпись, в нижнем правом углу; в финальных макетах он не использован.

## Источники

- Архив рулбука: C:/Users/APCHIHBA/Documents/Github/RLBK_ephrs.
- Исходные PSD: C:/Users/APCHIHBA/Downloads/01_Inbox/Bigtournamneggbanner_spring.psd и Bigtournamneggw_spring_Open.psd.
- Универсальный логотип: локальный Downloads/Logo_universal.png, размер совпадает с одноимённым файлом Drive (1119424 байта).
- Drive: https://drive.google.com/drive/folders/1z-CBsEYUPWspUyBB_-ytT0sgpNpljqfA
- Предыдущие материалы: https://drive.google.com/drive/folders/1tx0dXjd95qNlSjHHehrcJvh3mDKQl4S_

## Photoshop

Photoshop Beta открыт; рабочий доступ через COM Photoshop.Application и ExtendScript DoJavaScript/DoJavaScriptFile. Захват окна через Computer Use не сработал: SetIsBorderRequired / интерфейс не поддерживается. Визуальная проверка выполнена по экспортированным PNG.

Найден инструмент с навыком: https://github.com/Vaxaxas/photoshop-mcp-windows-first (skills/image-editing-agent). Не устанавливался: встроенный COM-интерфейс позволил выполнить задачу без него.

Рулбук для третьего турнира пока не обновлялся: это следующий отдельный этап после согласования графики.

## Revision 3 — 2026-09-11
- Current layered deliverables: output/EWC3_Registration_Banner_v3.psd, output/EWC3_Registration_Announcement_v3.psd, output/Logo_Autumn2_v3.psd; matching PNG exports.
- Imagegen numeral variants A/B are separate layers in logo PSD; A enabled. Neutral background comparison previews: output/Logo_v3_A_preview.png and Logo_v3_B_preview.png.
- Imagegen character mask aligned to original shield and applied as actual Photoshop layer mask to foreground protection layer. Two small generated leaves replace inner wreath. Previous attempts hidden.
- Five different generated broken ink accents individually positioned behind announcement text; actual transparency, no repeated single swash. OPEN cream for contrast.
- Banner typography rebuilt as editable text with solid dark blue/oxblood, no outline; prize line moved below horizon. Continuous panorama retained.
- Logo PNG asset refreshed in both poster smart objects. Previous versions retained. Visual inspection of exports completed.

## Logo revision 4
Built-in Imagegen: simplified flat comic wreath (thick black contour, minimal veins, no hatching) and angular cream 3 fitted to pentagonal badge. Assets: autumn_wreath_comic_v4.png, numeral3_angular_v4.png. Updated final logo and both final posters, refreshed PNG exports. Previous final PSD snapshots archived under output/archive_before_logo_v4_*; editable revision output/EWC3_Logo_Autumn_v4.psd. User typography edits retained.

## Revision 5
Integrated distressed foliage generated with built-in Imagegen: irregular ink edges, print grain, muted autumn color, sprigs crossing shield rim in front of tower bases and behind elbows and ribbon. Original foreground restored through existing generated mask. Final PSD and exports updated; v4 archived. New asset assets/logo_integrated_v5_alpha.png, editable output/EWC3_Logo_Integrated_v5.psd. Gray checkerboard from generator removed by neutral-color alpha cleanup; native Photoshop assembly retained original foreground. Preview output/Logo_v5_preview.png.

## Revision 6
Restored actual Original universal shield layer (original frame, towers and lettering) rather than generated shield. Imagegen foliage-only extraction/refinement requested ~15% less distress; asset foliage_v6_alpha.png; composited above shield and below masked original foreground. Edition badge and angular numeral moved above all foreground layers to remove obscuring corner. Final logo/posters PNG and PSD refreshed; previous finals archived. Only three final documents open. Preview output/Logo_v6_preview.png. Texture reduction is visual approximation, not measured percentage.

## Revision 7
Regenerated foliage: slender upper tips, antique gold/copper/terracotta/olive palette, restrained print texture. Upper foliage behind original shield so towers unobscured; separate lower masked foliage integrates behind original character. Updated final PSDs and PNG exports; v6 archived; only final three documents open. Asset foliage_v7_alpha.png; preview output/Logo_v7_preview.png. Built-in Imagegen used.

## Mask cleanup 2026-09-12
Removed 35px feather from lower foliage mask, manually traced reveal boundary around lower leaf tips to eliminate translucent ghost leaves and hide upper twig stubs. Checked right detail crop output/mask_detail.png. Updated three final PSDs and PNG exports; previous versions archived.

## Edge cleanup 2026-09-12
Foliage layers rasterized with masks retained; 2px Photoshop defringe and neutral light fringe cleanup; original foreground mask contracted 1px. Checked both detail crops. Final three PSD/PNG updated. Prior editable smart-object state archived in output/archive_before_edge_cleanup_*.
